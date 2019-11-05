const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
// console.log('db init----->', db)

exports.main = async (event, context) => {
  console.log(event)
  console.log(context)
  const todos = await db.collection('todos').get()
  console.log(todos)
  return todos
}
