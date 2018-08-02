const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
    ctx.body = "电影首页"
})
.listen(3000, () => {
    console.log('Server is Start')
})