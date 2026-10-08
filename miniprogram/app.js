const api = require('./utils/api.js')
const cfg = require('./config.js')

App({
  globalData: {
    useMock: cfg.useMock,
    env: cfg.env,
    adminOpenids: cfg.adminOpenids,
    currentUser: null,     // 当前登录用户（含 _openid / authStatus / role 等）
    statusBarHeight: 20,
    navBarHeight: 44
  },

  onLaunch() {
    const sys = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    this.globalData.statusBarHeight = sys.statusBarHeight || 20

    if (!cfg.useMock && cfg.env) {
      if (!wx.cloud) {
        console.error('当前基础库不支持云开发，请使用 2.2.3 及以上版本')
      } else {
        wx.cloud.init({ env: cfg.env, traceUser: true })
      }
    }

    api.init(this.globalData)

    // 自动登录（获取 openid 并落地用户记录）
    api.login().then(user => {
      this.globalData.currentUser = user
      if (typeof this.userReadyCallback === 'function') {
        this.userReadyCallback(user)
      }
    }).catch(err => {
      console.error('登录失败', err)
    })
  },

  // 供页面注册：登录完成后回调
  userReadyCallback: null
})
