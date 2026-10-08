const api = require('../../utils/api')

Page({
  data: {
    list: [],
    loading: true
  },

  onLoad() {
    this.loadList()
  },

  onPullDownRefresh() {
    this.loadList(() => wx.stopPullDownRefresh())
  },

  loadList(done) {
    this.setData({ loading: true })
    api.listItems({})
      .then(res => {
        const arr = (res && res.list) || []
        this.setData({ list: arr, loading: false })
        done && done()
      })
      .catch(err => {
        console.error('列表加载失败', err)
        this.setData({ list: [], loading: false })
        done && done()
      })
  }
})
