const {readFile, readFileSync} = require('fs')
const {resolve} = require('path')

setImmediate(() => console.log('[阶段3.immediate] immediate 回调1'))
setImmediate(() => console.log('[阶段3.immediate] immediate 回调2'))
setImmediate(() => console.log('[阶段3.immediate] immediate 回调3'))

Promise.resolve().then(() => {
    console.log('[...待切入下一阶段] Promise 回调1')
    setImmediate(() => console.log('[阶段3.immediate] Promise 回调1 新增 immediate 回调4'))
})

readFile(resolve(__dirname, '../../package.json'), 'utf-8', data => {
    console.log('[阶段2.I/O操作] 读文件 回调1')
    readFile(resolve(__dirname, '../../music.mp3'), 'utf-8', data => {
        console.log('[阶段2.I/O操作] 读文件 回调2')
        setImmediate(() => console.log('[阶段3.immediate] 读文件 回调2 新增 immediate 回调5'))
    })
    setImmediate(() => {
        console.log('[阶段3.immediate] 读文件 回调1 新增 immediate 回调6')
        Promise.resolve().then(() => {
            console.log('[...待切入下一阶段] Promise 回调2')
            process.nextTick(() => console.log('[...待切入下一阶段] Promise 回调2 新增 nextTick 回调6'))
        })
        .then(() => console.log('[...待切入下一阶段] Promise 回调3'))
    })
    setImmediate(() => {
        console.log('[阶段3.immediate] 读文件 回调1 新增 immediate 回调7')
        process.nextTick(() => console.log('[...待切入下一阶段] immediate 回调7 新增 nextTick 回调7'))
        console.log('[...待切入下一阶段] 这块正在同步阻塞的读取一个mp3文件')
        const music = readFileSync(resolve(__dirname, '../../music.mp3'), 'utf-8')
        process.nextTick(() => console.log('[...待切入下一阶段] immediate 回调7 新增 nextTick 回调8'))
        readFile(resolve(__dirname, '../../package.json'), 'utf-8', data => {
            console.log('[阶段2.I/O操作] 读文件 回调3')
            setImmediate(() => console.log('[阶段3.immediate] 读文件 回调3 新增 immediate 回调5'))
            setTimeout(() => console.log('[阶段1...定时器] 定时器 回调7'), 0)
        })
    })
    process.nextTick(() => console.log('[...待切入下一阶段] 读文件 回调1 新增 nextTick 回调9'))
    setTimeout(() => console.log('[阶段1...定时器] 读文件 回调1 新增 定时器 回调8'), 0)
    setTimeout(() => console.log('[阶段1...定时器] 读文件 回调1 新增 定时器 回调9'), 0)
})

setTimeout(() => {
    console.log('[阶段1...定时器] 定时器 回调2')
    process.nextTick(() => console.log('[...待切入下一阶段] nextTick 回调5'))
}, 0)
setTimeout(() => console.log('[阶段1...定时器] 定时器 回调3'), 0)
setTimeout(() => console.log('[阶段1...定时器] 定时器 回调4'), 0)

process.nextTick(() => console.log('[...待切入下一阶段] nextTick 回调1'))
process.nextTick(() => {
    console.log('[...待切入下一阶段] nextTick 回调2')
    process.nextTick(() => console.log('[...待切入下一阶段] nextTick 回调4'))
})
process.nextTick(() => console.log('[...待切入下一阶段] nextTick 回调3'))

