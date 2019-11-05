const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async ({ message }, context) => {
  try {
    if (!message) return
    const todos = await db.collection('todos').add({
      data: {
        message,
        done: false
      }
    })
    console.log(todos)
    return todos
  } catch (e) {
    console.log(e)
  }
}
