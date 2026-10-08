// 通用工具函数

function pad(n) { return n < 10 ? '0' + n : '' + n }

function formatDateTime(d) {
  d = d || new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function formatDate(d) {
  d = d || new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function nowStr() { return formatDateTime(new Date()) }

function uid(prefix) {
  return (prefix || 'id') + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

// 返回 n 天前的 Date
function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

// 时间范围起点（今天 00:00 / 近三天 / 近一周）
function rangeStart(range) {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  if (range === 'today') return d
  if (range === '3d') { d.setDate(d.getDate() - 3); return d }
  if (range === '7d') { d.setDate(d.getDate() - 7); return d }
  return null // 'all'
}

module.exports = { pad, formatDateTime, formatDate, nowStr, uid, daysAgo, rangeStart }
