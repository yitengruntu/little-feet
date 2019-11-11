// import pro from '../../utils/promisifyWx'
const cardList = [{
  name: '待办清单',
  jumpUrl: '/pages/todoList/index/index'
}]

Page({
  data: {
    cardList
  },
  onLoad () {
    // console.log(pro)
    // pro.showToast()
  }
})
