const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (params, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const openId = wxContext.OPENID
    const users = await db.collection('users')
      .where({
        openId
      })
      .get()
    console.log(users)
    const isSelf = users.data.length && users.data[0].isAdmin
    console.log('isSelf', isSelf)
    if (!isSelf) return {
      authed: false
    }
    const { _id, ...user } = users.data[0]
    const changed = !user.rawData || user.rawData !== params.rawData
    await db.collection('users')
      .where({
        openId
      })
      .update({
        data: {
          ...user,
          ...params
        }
      })
    return {
      changed,
      authed: true
    }
  } catch (e) {
    console.log(e)
  }
}
