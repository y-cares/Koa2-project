// 子进程模块
// 子进程的作用：爬虫数据的envalute方法容易造成主进程的阻塞、崩溃。
// 而子进程的作用就可以避免造成主进程的崩溃等缺点
// http://nodejs.cn/api/child_process.html#child_process_child_process_fork_modulepath_args_options
const cp = require('child_process')
const { resolve } = require('path')

;(async () => {
    const script = resolve(__dirname, '../crawler/trailer-list')
    // cp.fork() 根据路径返回子进程对象
    const child = cp.fork(script, [])
    // 辨别爬虫脚本是否执行
    let incoked = false

    // 当进程出错的时候
    child.on('error', err => {
        if (incoked) return
        incoked = true
        console.log('err: ', err)
    })

    // 当进程退出的时候
    child.on('exit', code => {
        if (incoked) return
        incoked = true

        const err = code === 0 ? null : new Error('exit code' + code)
        console.log('exit: ', err)
    })

    // 消息的获取
    child.on('message', data => {
        let result = data.result
        console.log('result: ', result)
    })
})()
