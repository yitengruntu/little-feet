Page({
  data: {
    list: [],
    inputValue: ''
  },
  onLoad () {
    console.log(wx.cloud)
    if (!wx.cloud) {
      return
    }
    this.getList()
  },
  async getList () {
    const { result: { data } } = await wx.cloud.callFunction({ name: 'getTodoList' })
    console.log(data)
    this.setData({
      list: data
    })
  },
  async addTodo () {
    if (!this.data.inputValue) return
    console.log('addTodo')
    const res = await wx.cloud.callFunction({
      name: 'addTodo',
      data: {
        message: this.data.inputValue
      }
    })
    console.log(res)
    this.setData({
      inputValue: ''
    })
    this.getList()
    // this.setData({
    //   list: data
    // })
  },
  async finishTodo (e) {
    console.log(e.target.id)
    const id = e.target.id
    await wx.cloud.callFunction({
      name: 'finishTodo',
      data: { id }
    })
    const index = this.data.list.findIndex(todo => todo._id === id)
    console.log(index)
    this.getList()
    // const originList = this.data.list.concat()
    // originList.splice(index, 1)
    // this.setData({
    //   list: originList
    // })
  },
  onInputChange (e) {
    console.log(e)
    this.setData({
      inputValue: e.detail.value
    })
  }
})
