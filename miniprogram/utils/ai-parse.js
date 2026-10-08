/**
 * AI 识别结果解析（小程序端）
 * ------------------------------------------------------------------
 * 与 cloudfunctions/ai-recognize/lib.js 保持一致的两件事：
 *   1. 从模型输出里稳健地抠出 JSON（兼容围栏、废话、中文引号、尾逗号）
 *   2. 把模型给的类别映射回小程序类别白名单
 * 前端直连 AI 时使用；走云函数时由云函数内部完成同样的解析。
 */

// 与 utils/category.js 的 CATE_LIST 一致
const CATE_LIST = ['证件卡类', '电子产品', '衣物', '学习用品', '生活用品', '配饰', '钥匙', '其他']

// 顺序即优先级：先精确命中白名单，再按关键词包含命中
const CATE_SYNONYM = [
  ['证件卡类', ['证件卡', '校园卡', '一卡通', '学生证', '身份证', '银行卡', '饭卡', '借书证', '门禁卡', '公交卡', '社保卡', '会员卡', '证件', '卡片', '卡类']],
  ['电子产品', ['手机', '耳机', '充电宝', '移动电源', '电脑', '笔记本电', '平板', 'ipad', '键盘', '鼠标', '相机', '手环', '智能手表', '手表', '计算器', 'u盘', '优盘', '数据线', '充电器', '充电头', '音箱', '音响', '电子']],
  ['钥匙', ['钥匙', '钥匙串', '车钥匙', '门钥匙']],
  ['配饰', ['眼镜', '墨镜', '首饰', '项链', '手链', '耳环', '耳钉', '戒指', '发卡', '发夹', '帽子', '腰带', '皮带', '围巾']],
  ['衣物', ['衣服', '外套', '上衣', '裤子', '裙子', '卫衣', '校服', '棒球服', '羽绒服', '大衣', 't恤', '衬衫', '手套', '袜子', '鞋', '服']],
  ['学习用品', ['书', '课本', '教材', '笔记', '笔', '文具', '书包', '尺子', '橡皮', '文件夹', '作业', '画板']],
  ['生活用品', ['水杯', '保温杯', '杯子', '水壶', '雨伞', '伞', '背包', '双肩包', '包', '饭盒', '毛巾', '梳子', '镜子', '玩具', '日用品', '生活']]
]

function tidy(v) {
  if (v === null || v === undefined) return ''
  return String(v)
    .replace(/[​-‏‪-‮﻿]/g, '')
    .replace(/^[ '"“”‘’`]+|[ '"“”‘’`]+$/g, '')
    .replace(/[！-～]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .trim()
}

function normalizeCategory(raw) {
  const c = tidy(raw)
  if (!c) return '其他'
  if (CATE_LIST.indexOf(c) > -1) return c
  const low = c.toLowerCase()
  for (let i = 0; i < CATE_SYNONYM.length; i++) {
    const target = CATE_SYNONYM[i][0]
    const words = CATE_SYNONYM[i][1]
    for (let j = 0; j < words.length; j++) {
      if (low.indexOf(words[j]) > -1) return target
    }
  }
  return '其他'
}

function buildPrompt(typeHint) {
  const hint = typeHint === '招领' ? '这是一张拾到物品的照片' : '这是一张丢失物品的照片'
  return [
    hint + '。请识别照片中的主体物品，用于校园失物招领。',
    '只输出一个 JSON 对象，不要输出任何解释文字、不要加 markdown 代码块，格式如下：',
    '{"title":"物品名称，10字以内，含颜色+材质/品牌等可辨识特征","desc":"外观描述，30-60字，说明颜色、材质、尺寸、明显磨损或标记","category":"从 [证件卡类, 电子产品, 衣物, 学习用品, 生活用品, 配饰, 钥匙, 其他] 中选一个最贴近的"}',
    '如果照片模糊或看不清主体，则把 title 设为「无法辨认」，desc 说明原因。'
  ].join('\n')
}

/** 从模型输出中抠出 JSON 对象，失败返回 null */
function extractJson(text) {
  if (!text) return null
  let s = String(text).trim()
  s = s.replace(/^```(?:json|JSON)?\s*/, '').replace(/```\s*$/, '').trim()

  let start = -1, depth = 0, inStr = false, esc = false
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (inStr) {
      if (esc) esc = false
      else if (ch === '\\') esc = true
      else if (ch === '"') inStr = false
      continue
    }
    if (ch === '"') { inStr = true; continue }
    if (ch === '{') { if (depth === 0) start = i; depth++; continue }
    if (ch === '}') { depth--; if (depth === 0 && start > -1) { s = s.slice(start, i + 1); break } continue }
  }
  if (start === -1) return null

  const tries = [
    s,
    s.replace(/[“”]/g, '"').replace(/[‘’]/g, "'"),
    s.replace(/,\s*([}\]])/g, '$1')
  ]
  for (let i = 0; i < tries.length; i++) {
    try {
      const obj = JSON.parse(tries[i])
      if (obj && typeof obj === 'object') return obj
    } catch (e) { /* 继续尝试下一种修复 */ }
  }
  return null
}

function pickFields(obj) {
  const o = obj || {}
  const first = function () {
    for (let i = 0; i < arguments.length; i++) {
      const v = o[arguments[i]]
      if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim()
    }
    return ''
  }
  return {
    title: tidy(first('title', 'name', '物品名称', '名称', 'item')),
    desc: tidy(first('desc', 'description', 'detail', '描述', '外观')),
    category: normalizeCategory(first('category', 'type', '类别', '分类'))
  }
}

/** 从模型的任意返回结构里取文本 */
function textOf(result) {
  if (!result) return ''
  if (typeof result === 'string') return result
  if (typeof result.text === 'string') return result.text
  if (result.data && typeof result.data.text === 'string') return result.data.text
  if (Array.isArray(result.choices) && result.choices[0]) {
    const c = result.choices[0]
    if (typeof c === 'string') return c
    const m = c.message
    if (Array.isArray(m)) return m.map(x => (typeof x === 'string' ? x : (x && x.text) || '')).join('')
    if (m && typeof m === 'object') {
      const content = m.content
      if (typeof content === 'string') return content
      if (Array.isArray(content)) return content.map(x => (typeof x === 'string' ? x : (x && x.text) || '')).join('')
    }
    if (typeof c.text === 'string') return c.text
  }
  if (typeof result.content === 'string') return result.content
  if (Array.isArray(result.content)) return result.content.map(x => (typeof x === 'string' ? x : (x && x.text) || '')).join('')
  return ''
}

module.exports = {
  CATE_LIST,
  CATE_SYNONYM,
  tidy,
  buildPrompt,
  normalizeCategory,
  extractJson,
  pickFields,
  textOf
}
