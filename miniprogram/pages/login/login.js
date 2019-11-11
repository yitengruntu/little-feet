import pro from '../../utils/promisifyWx'

Page({
  data: {
    inited: false,
    loading: false,
    noAuth: false
  },
  async onLoad (e) {
    if (e.expired) wx.removeStorageSync('user') // 进了项目页面发现失效了退回到此页，则清除缓存重新登录
    if (!wx.cloud) return
    let permissions = []
    // 1. 查看缓存
    const user = wx.getStorageSync('user')
    permissions = user && user.permissions
    // 2. 请求接口
    if (!permissions) {
      const userInfo = await this.getUserInfo()
      if (userInfo) permissions = await this.handleLoginProcess(userInfo)
    }
    this.handleRedirect(permissions)
    // 3. 展示页面
    if (!permissions || permissions.length === 0) {
      this.setData({
        inited: true
      })
    }
  },
  async getUserInfo () {
    const { authSetting } = await pro.getSetting()
    if (authSetting['scope.userInfo']) {
      const { rawData, userInfo } = await pro.getUserInfo()
      return { rawData, ...userInfo }
    }
    return null
  },
  async login (data) {
    const res = await wx.cloud.callFunction({
      name: 'login',
      data
    })
    return res.result
  },
  async handleLoginProcess (userInfo) {
    const data = await this.login(userInfo)
    // 存缓存
    wx.setStorage({
      key: 'user',
      data
    })
    return data && data.permissions
  },
  async onGetUserInfo (e) {
    const { rawData, userInfo } = e.detail
    if (!userInfo) return
    this.setData({ loading: true })
    const permissions = await this.handleLoginProcess({ rawData, ...userInfo })
    if (!permissions || permissions.length === 0) {
      this.setData({
        loading: false,
        noAuth: true
      })
      return
    }
    this.handleRedirect(permissions)
  },
  handleRedirect (permissions) {
    if (!permissions || permissions.length === 0) return
    permissions.length > 1
      ? wx.redirectTo({ url: '/pages/index/index' })
      : wx.redirectTo({ url: `/pages/${permissions[0]}/index/index` })
  }
})
