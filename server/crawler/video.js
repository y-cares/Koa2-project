// api 文档： https://my.oschina.net/reamd7/blog/1634846?spm=a2c4e.11153940.blogcont607102.74.105b1461CY7AAE#browserclose
const puppeteer = require('puppeteer')

// 参数 tags 可为影片类型
const base = `https://movie.douban.com/subject/`
const doubanId = 27605698

// promise 的一个定时函数
const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time)
})

;(async () => {
    // process.on('message', async movies => {
        console.log('Start visit the video page')
        // puppeteer.launch() 创建一个模拟浏览器
        const browser = await puppeteer.launch({
            // 传递给浏览器实例的其他参数
            args: ['--no-sandbox'],
            dumpio: false
        })

        // 创建一个新页面
        const page = await browser.newPage()
        // for (let i = 0; i < movies.length; i++) {
            // let doubanId = movies[i].doubanId
            // 进入 豆瓣电影的地址
            await page.goto(base + doubanId, {
                // waitUntil 给定一系列事件字符串，在所有事件被触发后，导航被认为是成功的
                // networkidle2 当网络连接数不超过2 500ms 时，请考虑完成导航
                waitUntil: 'networkidle2'
            })
        // }
        
        // 延迟，等待页面加载完成
        await sleep(1000)

        // 获取网页内容, 向页面注入我们的函数
        const result = await page.evaluate(() => {
            const $ = window.$
            const it = $('.related-pic-video')
      
            if (it && it.length > 0) {
                const link = it.attr('href')
                const cover = it.css('background-image').split('"')[1].split('"')[0]
      
                return {
                    link,
                    cover
                }
            }
      
            return {}
          })

        // 爬取视频
        let video
        if (result.link) {
            await page.goto(result.link, {
                waitUntil: 'networkidle2'
            })

            await sleep(2000)

            video = await page.evaluate(() => {
                const $ = window.$
                const it = $('source')

                if (it && it.length > 0) {
                    return it.attr('src')
                }
                return ''
            })
        }
        
        const data = {
            video,
            doubanId,
            cover: result.cover
        }

        // 关闭浏览器
        browser.close()

        // 推送到子进程
        process.send(data)
        process.exit(0)
    // })
})()

