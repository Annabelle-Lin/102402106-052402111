/**
 * 内联 SVG 图标集
 * ------------------------------------------------------------------
 * 全部以 data-uri 形式内联，零网络请求、零额外体积。
 * 用法：icon('home', '#8B6FE8', 24)
 */

function wrap(inner, size, color, opts) {
  opts = opts || {}
  const sw = opts.sw || 1.9
  const fill = opts.fill || 'none'
  const extra = opts.extra || ''
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" ` +
    `fill="${fill}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">` +
    extra + inner + `</svg>`
  return 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(svg)
}

// —— 描边型图标路径 ——
const LINE = {
  home:   '<path d="M3.2 10.6 12 4l8.8 6.6V19a1.6 1.6 0 0 1-1.6 1.6h-3.4v-5.4H8.2v5.4H4.8A1.6 1.6 0 0 1 3.2 19z"/>',
  map:    '<path d="M12 21.2s6.4-5.6 6.4-11A6.4 6.4 0 0 0 5.6 10.2c0 5.4 6.4 11 6.4 11z"/><circle cx="12" cy="10.2" r="2.5"/>',
  doc:    '<rect x="5" y="3.4" width="14" height="17.2" rx="3"/><path d="M9 8.6h6M9 12.4h6M9 16.2h3.4"/>',
  user:   '<circle cx="12" cy="8" r="3.8"/><path d="M4.8 20.4c0-3.6 3.2-6 7.2-6s7.2 2.4 7.2 6"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.4"/><path d="m20 20-3.6-3.6"/>',
  bell:   '<path d="M18 16.2V11a6 6 0 1 0-12 0v5.2l-1.6 2h15.2z"/><path d="M10.2 20.4a2 2 0 0 0 3.6 0"/>',
  tag:    '<path d="M11.4 3.4H20a.6.6 0 0 1 .6.6v8.6L12 21.2 2.8 12z"/><circle cx="16.4" cy="7.6" r="1.5"/>',
  date:   '<rect x="3.6" y="5.2" width="16.8" height="15.2" rx="3"/><path d="M3.6 9.6h16.8M8.4 3.4v3.4M15.6 3.4v3.4"/>',
  image:  '<rect x="3.4" y="4.8" width="17.2" height="14.4" rx="3.2"/><circle cx="9" cy="10" r="1.7"/><path d="m4 17 4.6-4.4 3.6 3.2 3-2.6 4.4 4"/>',
  camera: '<path d="M3.6 8.8A2.4 2.4 0 0 1 6 6.4h1.8l1.4-2h5.6l1.4 2H18a2.4 2.4 0 0 1 2.4 2.4v8A2.4 2.4 0 0 1 18 19.2H6a2.4 2.4 0 0 1-2.4-2.4z"/><circle cx="12" cy="12.8" r="3.4"/>',
  grid:   '<rect x="4" y="4" width="6.6" height="6.6" rx="2"/><rect x="13.4" y="4" width="6.6" height="6.6" rx="2"/><rect x="4" y="13.4" width="6.6" height="6.6" rx="2"/><rect x="13.4" y="13.4" width="6.6" height="6.6" rx="2"/>',
  close:  '<path d="M6 6 18 18M18 6 6 18"/>',
  check:  '<path d="m5 12.6 4.6 4.6L19 7.6"/>',
  plus:   '<path d="M12 5v14M5 12h14"/>',
  copy:   '<rect x="8.4" y="8.4" width="11.2" height="11.2" rx="3"/><path d="M15.6 8.4V6.8A2.4 2.4 0 0 0 13.2 4.4H6.4A2.4 2.4 0 0 0 4 6.8v6.8a2.4 2.4 0 0 0 2.4 2.4h1.6"/>',
  phone:  '<path d="M6.4 3.6h3l1.6 4-2 1.4a12 12 0 0 0 6 6l1.4-2 4 1.6v3a2 2 0 0 1-2.2 2A16.4 16.4 0 0 1 4.4 5.8a2 2 0 0 1 2-2.2z"/>',
  edit:   '<path d="M15.6 4.6 19.4 8.4 8.8 19H5v-3.8z"/>',
  shield: '<path d="M12 3.2 19.4 6v6c0 4.4-3 7.6-7.4 9-4.4-1.4-7.4-4.6-7.4-9V6z"/><path d="m9.2 12 2 2 3.6-3.6"/>',
  info:   '<circle cx="12" cy="12" r="8.6"/><path d="M12 11.2v5M12 7.9v.2"/>',
  box:    '<path d="M3.6 7.6 12 3.4l8.4 4.2v8.8L12 20.6l-8.4-4.2z"/><path d="M3.6 7.6 12 11.8l8.4-4.2M12 11.8v8.8"/>',
  spark:  '<path d="M12 3.6 13.8 9l5.4 1.8-5.4 1.8L12 18l-1.8-5.4L4.8 10.8 10.2 9z"/>',
  clock:  '<circle cx="12" cy="12" r="8.6"/><path d="M12 7.4V12l3.4 2"/>',
  arrow:  '<path d="m9 5 7 7-7 7"/>',
  trash:  '<path d="M4.4 6.6h15.2M9.4 6.6V4.8A1.4 1.4 0 0 1 10.8 3.4h2.4a1.4 1.4 0 0 1 1.4 1.4v1.8"/><path d="M6.6 6.6 7.6 19a2 2 0 0 0 2 1.9h4.8a2 2 0 0 0 2-1.9l1-12.4"/><path d="M10.4 10.4v6.4M13.6 10.4v6.4"/>',
  zebra:  '<circle cx="12" cy="12" r="8.6"/><path d="M12 8.4v3.4l2.4 1.6"/>'
}

function icon(name, color, size, opts) {
  color = color || '#6E6B85'
  size = size || 24
  if (!LINE[name]) return ''
  return wrap(LINE[name], size, color, opts)
}

// 记住尺寸单位自适应：小程序 image 组件用 rpx，这里直接用 px 数值亦可
module.exports = {
  icon,
  LINE,
  /** 快捷：返回 3 个常用色号的同一图标 */
  iconSet: (name, size) => ({
    primary: icon(name, '#8B6FE8', size),
    mint: icon(name, '#4DD9A8', size),
    mute: icon(name, '#9C99B0', size),
    white: icon(name, '#FFFFFF', size)
  })
}
