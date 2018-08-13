// 参考资料
// 关于 setTimeout、setImmediate、process.nextTick
// https://blog.csdn.net/hkh_1012/article/details/53453138

const { readFile } = require('fs')
const eventEmitter = require('events')

class ee extends eventEmitter {

}

const yy = new ee()

yy.on('event', () => {
    console.log('出大事了')
})

setTimeout(() => {
    console.log('0毫秒后到起执行的定时器回调')
}, 0)

setTimeout(() => {
    console.log('100毫秒后到起执行的定时器回调')
}, 100)

setTimeout(() => {
    console.log('200毫秒后到起执行的定时器回调')
}, 200)


readFile('./package.json', 'utf-8', data => {
    console.log('完成文件 1 的读取操作的回调')
})

readFile('./README.md', 'utf-8', data => {
    console.log('完成文件 2 的读取操作的回调')
})

setImmediate(() => {
    console.log('immediate 立即回调')
})

process.nextTick(() => {
    console.log('process.nextTick 的第 1 次回调')
})

Promise.resolve().then(() => {
    yy.emit('event')
    process.nextTick(() => {
        console.log('process.nextTick 的第 2 次回调')
    })
    console.log('Promise 的第一次回调')
}).then(() => {
    console.log('Promise 的第二次回调')
})
