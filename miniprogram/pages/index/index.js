// import pro from '../../utils/promisifyWx'

const gradientArr = [{
  start: '#ea8d8d',
  end: '#a890fe'
}, {
  start: '#d8b5ff',
  end: '#1eae98'
}]

const cardList = [{
  name: '待办清单',
  jumpUrl: '/pages/todoList/index/index'
}]

for (const index in cardList) {
  const gradientLength = gradientArr.length
  cardList[index] = {
    ...cardList[index],
    ...gradientArr[Number(index) % gradientLength]
  }
}

Page({
  data: {
    cardList
  },
  onLoad () {
    // console.log(pro)
    // pro.showToast()
  }
})
