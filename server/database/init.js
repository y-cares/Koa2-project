// 初始化脚本
// mongoose文档：https://cnodejs.org/topic/595d9ad5a4de5625080fe118
const mongoose = require('mongoose')
// mongo的本地地址
const db = 'mongodb://localhost/douban-trailer'
const glob = require('glob')
const { resolve } = require('path')

// 指定mongoose的promise为node的promise
mongoose.Promise = global.Promise


exports.initSchemas = () => {
  // 获取 schema 文件夹下所有的js文件
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}

exports.initAdmin = async () => {
  const User = mongoose.model('User')
  let user = await User.findOne({
    username: 'Scott'
  })

  if (!user) {
    const user = new User({
      username: 'Scott',
      email: 'koa2@imooc.com',
      password: '123abc',
      role: 'admin'
    })

    await user.save()
  }
}

// 暴露接口
exports.connect = () => {
  let maxConnectTimes = 0

  return new Promise((resolve, reject) => {
    // 判断是否为生产环境，否则 则开启 debug 模式
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }

    // 连接mongo的本地地址
    mongoose.connect(db)
    // 断开链接
    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++

      if (maxConnectTimes < 5) {
        mongoose.connect(db)
      } else {
        throw new Error('数据库挂了吧，快去修吧少年')
      }
    })
    // 链接出错
    mongoose.connection.on('error', err => {
      console.log(err)
      maxConnectTimes++

      if (maxConnectTimes < 5) {
        mongoose.connect(db)
      } else {
        throw new Error('数据库挂了吧，快去修吧少年')
      }
    })
    // 打开链接
    mongoose.connection.once('open', () => {
      // const Dog = mongoose.model('Dog', { name: String })
      // const doga = new Dog({ name: '阿尔法' })

      // doga.save().then(() => {
      //   console.log('wang')
      // })
      resolve()
      console.log('MongoDB Connected successfully!')
    })
  })
}
