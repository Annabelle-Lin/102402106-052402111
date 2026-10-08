Component({
  options: { addGlobalClass: true },
  properties: {
    // 新接口
    text: { type: String, value: '暂无内容' },
    btn:  { type: String, value: '' },
    robot: { type: Boolean, value: false },
    // 兼容旧接口
    tip: { type: String, value: '' },
    sub: { type: String, value: '' },
    img: { type: String, value: '' },
    size: { type: Number, value: 0 }
  },
  data: {
    mascot: '/assets/images/mascot-bunny.png',
    robotImg: '/assets/images/robot-assist.png'
  },
  methods: {
    onAction() {
      this.triggerEvent('action')
    }
  }
})
