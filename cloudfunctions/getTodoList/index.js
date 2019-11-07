const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
// console.log('db init----->', db)

exports.main = async ({ offset, all }, context) => {
  try {
    const params = {}
    if (!all) params.done = false
    const todos = await db.collection('todos')
      .where(params)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .skip(offset || 0)
      .get()
    return todos
  } catch (e) {
    console.log(e)
  }

}
