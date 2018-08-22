// 豆瓣api路径
// http://api.douban.com/v2/movie/subject/1764796
// request 的 promise 方法的上层封装
// 通过 request-promise-native 发送一个请求
const rp = require('request-promise-native')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

async function fetchMovie (item) {
  const url = `http://api.douban.com/v2/movie/${item.doubanId}`
  // 获取请求的数据
  const res = await rp(url)
  let body

  try {
    body = JSON.parse(res)
  } catch (err) {
    console.log(err)
  }

  return body
}

// 爬取豆瓣电影的详细数据
// 并对粗数据进行加工
;(async () => {
  let movies = await Movie.find({
    $or: [
      { summary: { $exists: false } },
      { summary: null },
      { year: { $exists: false } },
      { title: '' },
      { summary: '' }
    ]
  })

  for (let i = 0; i < movies.length; i++) {
    let movie = movies[i]
    let movieData = await fetchMovie(movie)

    if (movieData) {
      let tags = movieData.tags || []

      movie.tags = movie.tags || []
      movie.summary = movieData.summary || ''
      movie.title = movieData.alt_title || movieData.title || ''
      movie.rawTitle = movieData.title || ''

      if (movieData.attrs) {
        // 拿到电影的类型
        movie.movieTypes = movieData.attrs.movie_type || []
        movie.year = movieData.attrs.year[0] || 2500

        for (let i = 0; i < movie.movieTypes.length; i++) {
          let item = movie.movieTypes[i]
          let cat = await Category.findOne({
            name: item
          })

          if (!cat) {
            cat = new Category({
              name: item,
              movies: [movie._id]
            })
          } else {
            if (cat.movies.indexOf(movie._id) === -1) {
              cat.movies.push(movie._id)
            }
          }

          await cat.save()

          // 检查影片分类
          if (!movie.category) {
            movie.category.push(cat._id)
          } else {
            if (movie.category.indexOf(cat._id) === -1) {
              movie.category.push(cat._id)
            }
          }
        }

        // 拿到电影上映日期和国家
        let dates = movieData.attrs.pubdate || []
        let pubdates = []

        dates.map(item => {
          if (item && item.split('(').length > 0) {
            let parts = item.split('(')
            let date = parts[0]
            let country = '未知'

            if (parts[1]) {
              country = parts[1].split(')')[0]
            }

            pubdates.push({
              date: new Date(date),
              country
            })
          }
        })

        movie.pubdate = pubdates
      }
      // 对电影标签进行处理
      tags.forEach(tag => {
        movie.tags.push(tag.name)
      })

      await movie.save()
    }
  }
})()
