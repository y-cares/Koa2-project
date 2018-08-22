const {
  controller,
  get
} = require('../lib/decorator')
const {
  getAllMovies,
  getMovieDetail,
  getRelativeMovies
} = require('../service/movie')

@controller('/api/v0/movies')
export class movieController {
  // 查询全部电影请求
  @get('/')
  async getMovies (ctx, next) {
    const { type, year } = ctx.query
    const movies = await getAllMovies(type, year)

    ctx.body = {
      success: true,
      data: movies
    }
  }

  // 查询单个电影请求
  @get('/:id')
  async getMovieDetail (ctx, next) {
    const id = ctx.params.id
    // 查询相关电影
    const movie = await getMovieDetail(id)
    // 查询同类电影
    const relativeMovies = await getRelativeMovies(movie)

    ctx.body = {
      data: {
        movie,
        relativeMovies
      },
      success: true
    }
  }
}
