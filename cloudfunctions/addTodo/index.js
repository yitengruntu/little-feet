const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async ({ message }, context) => {
  try {
    if (!message) return
    const wxContext = cloud.getWXContext()
    const todos = await db.collection('todos').add({
      data: {
        message,
        done: false,
        createdAt: db.serverDate(),
        createdBy: wxContext.OPENID
      }
    })
    console.log(todos)
    return todos
  } catch (e) {
    console.log(e)
  }
}
