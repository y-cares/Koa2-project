// 子进程模块
// 子进程的作用：爬虫数据的envalute方法容易造成主进程的阻塞、崩溃。
// 而子进程的作用就可以避免造成主进程的崩溃等缺点
// http://nodejs.cn/api/child_process.html#child_process_child_process_fork_modulepath_args_options
const cp = require('child_process')
const { resolve } = require('path')
// 将数据储存到 mongoose
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

;(async () => {
  const script = resolve(__dirname, '../crawler/trailer-list')
  // cp.fork() 根据路径返回子进程对象
  const child = cp.fork(script, [])
  // 辨别爬虫脚本是否执行
  let invoked = false

  // 当进程出错的时候
  child.on('error', err => {
    if (invoked) return

    invoked = true

    console.log(err)
  })

  // 当进程退出的时候
  child.on('exit', code => {
    if (invoked) return

    invoked = true
    let err = code === 0 ? null : new Error('exit code ' + code)

    console.log(err)
  })

  // 消息的获取
  child.on('message', data => {
    let result = data.result

    // 将数据填充到数据库
    result.forEach(async item => {
      // 判断数据是否被存储过
      let movie = await Movie.findOne({
        doubanId: item.doubanId
      })

      // 储存数据
      if (!movie) {
        movie = new Movie(item)
        await movie.save()
      }
    })
  })
})()
