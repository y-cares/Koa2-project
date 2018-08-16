// 初始化脚本
// mongoose文档：https://cnodejs.org/topic/595d9ad5a4de5625080fe118
const mongoose = require('mongoose')
const glob = require('glob')
// mongo的本地地址
const db = 'mongodb://localhost/douban-trailer'
const {resolve} = require('path')
// 链接次数限制
let maxConnecTimes = 0

// 指定mongoose的promise为node的promise
mongoose.Promise = global.Promise

// 暴露接口
exports.connect = () => {
    return new Promise((resolve, reject) => {
        // 判断是否为生产环境，否则 则开启 debug 模式
        if (process.env.NODE_ENV !== 'production') mongoose.set('debug', true)

        // 连接mongo的本地地址
        mongoose.connect(db)
        // 断开链接
        mongoose.connection.on('disconnected', () => {
            maxConnecTimes ++
            if (maxConnecTimes < 5) {
                mongoose.connect(db)
            } else {
                throw new Error('数据库挂了，快去修吧，少年')
            }
        })
        // 链接出错
        mongoose.connection.on('error', (err) => {
            maxConnecTimes ++
            if (maxConnecTimes < 5) {
                mongoose.connect(db)
            } else {
                throw new Error('数据库挂了，快去修吧，少年')
                reject(err)
            }
            // console.log('MongoDB Connected Failed' + err)
            // mongoose.connect(db)
        })
        // 打开链接
        mongoose.connection.once('open', () => {
            resolve()
            console.log('MongoDB Connected Successfully!')
        })
    })
}

exports.initSchemas = () => {
    // 获取 schema 文件夹下所有的js文件
    glob.sync(resolve(__dirname, './schema/', '**/*.js')).forEach(require)
}

