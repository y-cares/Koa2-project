// 处理与登录或后台相关的数据
const mongoose = require('mongoose')
const User = mongoose.model('User')

// 验证密码的正确性
export const checkPassword = async (email, password) => {
  let match = false
  const user = await User.findOne({ email })

  if (user) {
    match = await user.comparePassword(password, user.password)
  }

  return {
    match,
    user
  }
}
