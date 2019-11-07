const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async ({ id }, context) => {
  try {
    const wxContext = cloud.getWXContext()
    return await db.collection('todos')
      .where({
        _id: id
      })
    .update({
      data: {
        done: true,
        finishedAt: db.serverDate(),
        finishedBy: wxContext.OPENID
      }
    })
  } catch (e) {
    console.error(e)
  }
}
