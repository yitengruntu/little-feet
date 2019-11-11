import dayjs from 'dayjs'
import Toast from 'vant-weapp/toast/toast'
import pro from '../../../utils/promisifyWx'
const PROJECT_NAME = 'todoList'

/**
 *  authStatus
 *  0: 没有登录
 *  1: 没有权限
 *  2: 成功
 *  3: loading
 */

Page({
  data: {
    list: [],
    inputValue: '',
    loading: false,
    noMore: false,
    viewHeight: 0,
    activeTab: 'todo',
    safeBottom: 0,
    authStatus: -1,
    isAdmin: false
  },
  async onLoad () {
    if (!wx.cloud) return
    const { permissions, isAdmin } = wx.getStorageSync('user') || {}
    if (!permissions || !permissions.includes(PROJECT_NAME)) {
      wx.redirectTo({ url: '/pages/login/login?expired=true' })
      return
    }
    this.setData({ isAdmin })
    this.setSafeBottom()
    this.getList()
  },
  onPullDownRefresh () {
    pro.stopPullDownRefresh()
    if (!this.data.loading) {
      this.getList()
    }
  },
  onReachBottom () {
    if (!this.data.loading && !this.data.noMore) {
      this.getList(this.data.list.length)
    }
  },
  onShareAppMessage () {
    return {
      title: '待办清单',
      path: '/pages/todoList/index/index',
      imageUrl: '../../../images/todos-cover.png'
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
  async setSafeBottom () {
    const { screenHeight, safeArea: { bottom } } = await pro.getSystemInfo()
    this.setData({
      safeBottom: screenHeight - bottom
    })
  },
  async getList (offset) {
    Toast.loading({
      message: '加载中',
      duration: 0
    })
    this.setData({ loading: true })
    const { result: { data } } = await wx.cloud.callFunction({
      name: 'getTodoList',
      data: {
        offset,
        all: this.data.activeTab === 'all',
        isAdmin: this.data.isAdmin
      }
    })
    const list = offset
      ? this.data.list.concat(data)
      : data
    for (const todo of list) {
      todo.createdTime = dayjs(todo.createdAt).format('MM-DD HH:mm')
    }
    this.setData({
      list,
      noMore: data.length < 20,
      loading: false
    })
    Toast.clear()
  },
  async addTodo () {
    if (!this.data.inputValue) return
    await wx.cloud.callFunction({
      name: 'addTodo',
      data: {
        message: this.data.inputValue
      }
    })
    this.setData({
      inputValue: ''
    })
    this.getList()
  },
  async finishTodo (e) {
    const id = e.target.id
    await wx.cloud.callFunction({
      name: 'finishTodo',
      data: { id }
    })

    this.getList()
  },
  onInputChange (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  onTabChange (e) {
    this.setData({
      activeTab: e.detail
    })
    this.getList()
  }
})
