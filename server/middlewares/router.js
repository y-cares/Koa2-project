// 路由文件的入口
const { Route } = require('../lib/decorator')
const { resolve } = require('path')

export const router = app => {
  const apiPath = resolve(__dirname, '../routes')
  const router = new Route(app, apiPath)

  router.init()
}
