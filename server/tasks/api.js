// 豆瓣api路径
// http://api.douban.com/v2/movie/subject/1764796
// request 的 promise 方法的上层封装
// 通过 request-promise-native 发送一个请求
const rp = require('request-promise-native')

async function fetchMovie (item) {
    const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}`
    // 获取请求的数据
    const res = await rp(url)
    return res
}

;(async () => {
    const movies = [
        { doubanId: 27098364,
            title: '超人之死',
            rate: 7.5,
            poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2526823875.jpg' },
        { doubanId: 26935281,
            title: '郊区的鸟',
            rate: 6.7,
            poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2526829021.jpg' }
    ]
    movies.map(async movie => {
        let movieData = await fetchMovie(movie)
        try {
            movieData = JSON.parse(movieData)
        } catch (err) {
            console.log(err)
        }
        console.log(movieData.tags)
        console.log(movieData.summary)
    })
})()



