import dayjs from 'dayjs'
import Toast from 'vant-weapp/toast/toast'
import pro from '../../../utils/promisifyWx'

Page({
  data: {
    list: [],
    inputValue: '',
    loading: false,
    noMore: false,
    viewHeight: 0,
    activeTab: 'todo',
    safeBottom: 0
  },
  onLoad () {
    if (!wx.cloud) {
      return
    }
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
  async setSafeBottom () {
    const { screenHeight, safeArea: { bottom }} = await pro.getSystemInfo()
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
        all: this.data.activeTab === 'all'
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
    console.log(e)
    this.setData({
      inputValue: e.detail.value
    })
  },
  onTabChange (e) {
    console.log('tab change', e.detail)
    this.setData({
      activeTab: e.detail
    })
    this.getList()
  }
})
