const api = require('./utils/api.js')
const cfg = require('./config.js')

App({
  globalData: {
    useMock: cfg.useMock,
    env: cfg.env,
    adminOpenids: cfg.adminOpenids,
    currentUser: null
  },
  onLaunch() {
    api.init(this.globalData)
    api.login().then(user => {
      this.globalData.currentUser = user
    }).catch(err => {
      console.error('登录失败', err)
    })
  }
})
