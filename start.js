// 运行时
// 使 node 运行并不支持的语法特性，如修饰符 @
// 被执行文件所需配置
require('babel-core/register')()
require('babel-polyfill')
// 被执行的文件
require('./server/index.js')
