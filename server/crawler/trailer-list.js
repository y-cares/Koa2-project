// api 文档： https://my.oschina.net/reamd7/blog/1634846?spm=a2c4e.11153940.blogcont607102.74.105b1461CY7AAE#browserclose
const puppeteer = require('puppeteer')

// 参数 tags 可为影片类型
const url = `https://movie.douban.com/tag/#/?sort=R&range=6,10&tags=`

// promise 的一个定时函数
const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time)
})

;(async () => {
    console.log('Start visit the target page')

    // puppeteer.launch() 创建一个模拟浏览器
    const browser = await puppeteer.launch({
        // 传递给浏览器实例的其他参数
        args: ['--no-sandbox'],
        dumpio: false
    })

    // 创建一个新页面
    const page = await browser.newPage()

    // 进入 豆瓣电影的地址
    await page.goto(url, {
        // waitUntil 给定一系列事件字符串，在所有事件被触发后，导航被认为是成功的
        // networkidle2 当网络连接数不超过2 500ms 时，请考虑完成导航
        waitUntil: 'networkidle2'
    })

    // 延迟，等待页面加载完成
    await sleep(3000)

    // 等待选择器more出现页面中，执行后续方法
    // more 为豆瓣电影页面中 加载更多 按钮的class名
    await page.waitForSelector('.more')
    // 只爬取2页的数据
    for (let i = 0; i < 1; i++) {
        // 延迟 3秒 后，点击 more 一次，
        await sleep(3000)
        await page.click('.more')
    }

    // 获取网页内容, 向页面注入我们的函数
    const result = await page.evaluate(() => {
        // 内容为页面所执行的脚本
        const $ = window.$
        const items = $('.list-wp a')
        
        // 收集最后请求的数据
        const links = []

        if (items.length >= 1) {
            items.each((index, item) => {
                const it = $(item)
                // 拿到页面中豆瓣电影的信息
                const doubanId = it.find('div').data('id')
                const title = it.find('.title').text()
                const rate = Number(it.find('.rate').text())
                // 图片地址分析：https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526405034.jpg
                // 将小图切换成大图
                const poster = it.find('img').attr('src').replace('s_ratio_poster', 'l_ratio_poster')
                
                links.push({
                    doubanId,
                    title,
                    rate,
                    poster
                })
            })
        }
        return links
    })

    // 关闭浏览器
    browser.close()
    // console.log(result)

    // 推送到子进程
    process.send({result})
    process.exit(0)
})()

