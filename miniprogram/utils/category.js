/**
 * 物品类别 · 单一数据源
 * ------------------------------------------------------------------
 * 图标匹配机制（唯一规则）：
 *   完全按照「用户发布时选择的类别」匹配，不存在任何关键词/自动识别。
 *   流程：归一化清洗 → 精确匹配 → 宽松匹配 → 兜底
 */
const icons = require('./icons.js')

// 类别 → 图标（唯一的匹配依据）
const CATE_ICON = {
  '证件卡类': 'card',
  '电子产品': 'earbuds',
  '衣物':     'jacket',
  '学习用品': 'book',
  '生活用品': 'bottle',
  '配饰':     'glasses',
  '钥匙':     'key'
  // 「其他」不在此表，走兜底
}

// 图标 key → 图片资源
const ICON_SRC = {
  bag:     '/assets/images/item-bag.png',
  phone:   '/assets/images/item-phone.png',
  earbuds: '/assets/images/item-earbuds.png',
  bottle:  '/assets/images/item-bottle.png',
  scarf:   '/assets/images/item-scarf.png',
  glasses: '/assets/images/item-glasses.png',
  key:     '/assets/images/item-key.png',
  laptop:  '/assets/images/item-laptop.png',
  wallet:  '/assets/images/item-wallet.png',
  card:    '/assets/images/item-card.png',
  jacket:  '/assets/images/item-jacket.png',
  book:    '/assets/images/item-book.png'
}

// 发布页「类别」选择器的选项
const CATE_LIST = ['证件卡类', '电子产品', '衣物', '学习用品', '生活用品', '配饰', '钥匙', '其他']

/**
 * 归一化：去首尾空白与零宽字符、剥外层引号、全角转半角
 * 兼容历史脏值，如 "'衣物配饰'" / "衣物 " / "衣物配饰"
 */
function tidy(v) {
  if (v === null || v === undefined) return ''
  let s = String(v)
  s = s.replace(/[\u200b-\u200f\u202a-\u202e\ufeff]/g, '').trim()
  for (let i = 0; i < 3; i++) {
    const m = s.match(/^['"“”‘’`]+(.+?)['"“”‘’`]+$/)
    if (m) s = m[1].trim()
    else break
  }
  s = s.replace(/[\uff01-\uff5e]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
  return s.trim()
}

// 旧类别名 → 新类别名（衣物配饰 已改名为 衣物）
const CATE_ALIAS = { '衣物配饰': '衣物' }

/**
 * 解析出最终使用的图标 key
 * @param {string} category 用户选择的类别
 * @param {string} type     寻物 / 招领（仅用于「其他」的兜底）
 * @returns {{ key: string, src: string, matched: boolean }}
 */
function resolveCategoryIcon(category, type) {
  const c = tidy(category)

  let key = ''
  // 空值直接兜底，避免空串在宽松匹配里误命中最短键名
  if (c) {
    // 1) 精确匹配
    key = CATE_ICON[c]

    // 2) 旧名兼容
    if (!key && CATE_ALIAS[c]) key = CATE_ICON[CATE_ALIAS[c]]

    // 3) 宽松匹配：类别名互为子串（如 "生活用" 命中 "生活用品"）
    //    要求归一化后不少于 2 个字符，防止过短串误命中
    if (!key && c.length >= 2) {
      const hit = Object.keys(CATE_ICON).find(k => k.indexOf(c) > -1 || c.indexOf(k) > -1)
      if (hit) key = CATE_ICON[hit]
    }
  }

  // 4) 兜底：寻物 → 书包，招领 → 钱包
  const matched = !!key
  if (!key) key = (type === '招领' ? 'wallet' : 'bag')

  return { key, src: ICON_SRC[key] || ICON_SRC.bag, matched }
}

module.exports = { CATE_ICON, CATE_ALIAS, CATE_LIST, ICON_SRC, tidy, resolveCategoryIcon }
