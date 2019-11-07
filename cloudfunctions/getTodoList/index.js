const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
// console.log('db init----->', db)

exports.main = async ({ offset, all }, context) => {
  let { OPENID, APPID, UNIONID } = cloud.getWXContext()
  console.log(OPENID, APPID, UNIONID)
  try {
    const params = {}
    if (!all) params.done = false
    // 获取本次请求的 todo
    const todos = await db.collection('todos')
      .where(params)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .skip(offset || 0)
      .get()
    // 去重所有 user 以方便查找 avatar
    const userSet = new Set()
    todos.data.forEach(todo => userSet.add(todo.createdBy))
    const users = await db.collection('users')
      .where({
        openId: _.in([...userSet])
      })
      .get()
    // 将头像地址写入 todo
    todos.data.map(todo => {
      console.log(users.data)
      const targetUser = users.data.find(user => {
        console.log(user, user.openId, todo.createdBy)
        return user.openId === todo.createdBy
      })
      todo.avatarUrl = targetUser && targetUser.avatarUrl
      console.log(targetUser, todo)
      return todo
    })
    return todos
  } catch (e) {
    console.log(e)
  }
}
