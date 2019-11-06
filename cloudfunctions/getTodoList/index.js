const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
// console.log('db init----->', db)

exports.main = async ({ offset }, context) => {
  try {
    const todos = await db.collection('todos')
      .orderBy('createdAt', 'desc')
      .limit(20)
      .skip(offset || 0)
      .get()
    return todos
  } catch (e) {
    console.log(e)
  }

}
