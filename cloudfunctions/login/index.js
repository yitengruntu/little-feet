const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const permissions_enum = ['todoList']
exports.main = async (params, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const openId = wxContext.OPENID
    const users = await db.collection('users')
      .where({
        openId
      })
      .get()
    const isRegistered = users.data.length > 0
    if (isRegistered) {
      const user = users.data[0]
      let permissions = users.permissions || []
      if (user.isAdmin) {
        permissions = permissions_enum
        // 更新权限字段 ->
        db.collection('users').where({
          openId
        })
        .update({
          data: {
            permissions
          },
        })
      }
      return {
        permissions,
        isAdmin: user.isAdmin
      }
    } else {
      // 判断不授权不给登录
      const result = await db.collection('users').add({
        data: {
          openId,
          permissions: ['todoList'],
          ...params
        }
      })
      return {
        permissions: ['todoList'],
        result
      }
    }
  } catch (e) {
    console.log(e)
  }
}
