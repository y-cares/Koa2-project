// 子进程模块
// 爬取视频详情，预告片视频
// http://nodejs.cn/api/child_process.html#child_process_child_process_fork_modulepath_args_options
const cp = require('child_process')
const { resolve } = require('path')

;(async () => {
    const script = resolve(__dirname, '../crawler/video')
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
        console.log('message: ', data)
    })
})()
