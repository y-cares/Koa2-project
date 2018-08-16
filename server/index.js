const Koa = require('koa')
// koa-views 模板引擎，可支持丰富的模板语言
// 本文采用 pug 模板，因为 pug 模板 可实现继承、模块拆解、定义变量等功能
// https://pug.bootcss.com/api/getting-started.html
const views = require('koa-views')
const mongoose = require('mongoose')
const { resolve } = require('path')
const { connect, initSchemas } = require('./databases/init')
const router = require('./routes')


// 调用 mongoose
;(async () => {
    await connect()
    initSchemas()
    // require('./tasks/movie')
    // require('./tasks/api')
    // require('./tasks/movie')
})()


const app = new Koa()

app.use(router.routes())
.use(router.allowedMethods())
.use(views(resolve(__dirname, './views'), {
    // extension 参数，识别后缀为 pug 的模板文件
    extension: 'pug'
}))
.use(async (ctx, next) => {
    // render 渲染函数，在context.js文件中已被挂载到ctx上
    await ctx.render('index', {
        you: 'Luke',
        me: 'Scott'
    })
})
.listen(3000, () => {
    console.log('Server is Start')
})