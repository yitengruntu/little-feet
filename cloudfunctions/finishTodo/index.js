const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async ({ id }, context) => {
  try {
    return await db.collection('todos')
      .where({
        _id: id
      })
    .update({
      data: {
        done: true
      }
    })
  } catch (e) {
    console.error(e)
  }
}
