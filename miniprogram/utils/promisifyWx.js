const promisify = name => option =>
  new Promise((resolve, reject) =>
    wx[name]({...option,
      success: resolve,
      fail: reject,
    })
  )

const pro = new Proxy(wx, {
  get(target, prop) {
    return promisify(prop)
  }
})

export default pro
