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
      let permissions = []
      const user = users.data[0]
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
      // TODO: 存入 users -> 分配基础权限
        // 判断不授权不给登录
      await db.collection('users').add({
        openId,
        permissions: ['todListo'],
        ...params
      })
      return {
        permissions: ['todoList']
      }
    }
  } catch (e) {
    console.log(e)
  }
}
