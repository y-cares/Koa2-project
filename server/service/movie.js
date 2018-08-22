// 获取电影信息 项目服务层
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

// 获取所有电影 查询数据
export const findAndRemove = async (id) => {
  const movie = await Movie.findOne({_id: id})

  if (movie) {
    await movie.remove()
  }
}

export const getAllMovies = async (type, year) => {
  let query = {}

  if (type) {
    // $in 修饰符可以轻松解决一键多值的查询情况
    query.movieTypes = {
      $in: [type]
    }
  }

  if (year) {
    query.year = year
  }

  const movies = await Movie.find(query)

  return movies
}

// 获取单个电影 查询数据
export const getMovieDetail = async (id) => {
  const movie = await Movie.findOne({_id: id})

  return movie
}

// 获取相关电影 查询数据
export const getRelativeMovies = async (movie) => {
  const movies = await Movie.find({
    movieTypes: {
      $in: movie.movieTypes
    }
  })

  return movies
}
