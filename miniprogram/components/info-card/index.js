const icons = require('../../utils/icons')
const cate = require('../../utils/category')

Component({
  options: { addGlobalClass: true },

  properties: {
    item: {
      type: Object,
      value: {},
      observer(v) {
        if (!v) return
        this.render(v)
      }
    },
    // 是否显示编辑/删除操作（仅“我的发布”页传入 true）
    editable: { type: Boolean, value: false }
  },

  data: {
    thumbSrc: '',
    badgeText: '寻物',
    badgeTone: 'mint',
    timeText: '',
    pinIcon: '',
    arrowIcon: '',
    icoEdit: '',
    icoTrash: ''
  },

  lifetimes: {
    attached() {
      this.setData({
        pinIcon:   icons.icon('map',   '#B7B4C7', 22),
        arrowIcon: icons.icon('arrow', '#C9C6D8', 22),
        icoEdit:   icons.icon('edit',  '#FFFFFF', 26),
        icoTrash:  icons.icon('trash', '#FFFFFF', 26)
      })
    }
  },

  methods: {
    render(item) {
      // 缩略图：只按“用户选择的类别”显示对应图标
      // 注意：列表卡片刻意不展示用户上传的照片，保证首页视觉统一
      // 用户照片在「详情页」查看
      const r = cate.resolveCategoryIcon(item.category, item.type)

      const text = item.type === '招领' ? '招领' : '寻物'
      const tone = item.type === '招领' ? 'purple' : 'mint'

      this.setData({
        thumbSrc: r.src,
        badgeText: text,
        badgeTone: tone,
        timeText: formatTime(item.time || item.createTime)
      })
    },

    itemId() {
      const it = this.data.item || {}
      return it._id || it.id || ''
    },

    onTap() {
      // 云数据库主键是 _id，mock 数据同样使用 _id
      this.triggerEvent('click', { id: this.itemId() })
    },

    onEdit() {
      this.triggerEvent('edit', { id: this.itemId() })
    },

    onDelete() {
      this.triggerEvent('delete', { id: this.itemId() })
    },

    // 防止操作按钮把点击冒泡到卡片
    noop() {}
  }
})

function formatTime(v) {
  if (!v) return ''
  let s = String(v).replace('T', ' ')
  // 2026-09-27 14:30:00 → 9月27日 14:30
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})[ ]?(\d{2}:\d{2})?/)
  if (m) {
    const mo = Number(m[2])
    const d = Number(m[3])
    return mo + '月' + d + '日' + (m[4] ? ' ' + m[4] : '')
  }
  return s
}
