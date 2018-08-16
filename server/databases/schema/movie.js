// 电影的模型文件
const mongoose = require('mongoose')
// 建模工具
const Schema = mongoose.Schema
// Mixed 数据类型可存储任何数据，主要用于存储变化比较大的数据
const { ObjectId, Mixed } = Schema.Types

const movieSchema = new Schema({
    // 影片数据
    doubanId: {
        unique: true,
        type: String
    },
    category: [{
        type: ObjectId,
        // 指向关系
        ref: 'Category'
    }],

    rate: Number,
    title: String,
    summary: String,
    video: String,
    poster: String,
    cover: String,

    // 七牛云图床数据
    videoKey: String,
    posterKey: String,
    coverKey: String,

    // 上映数据
    rawTitle: String,
    movieTypes: [String],
    pubdate: Mixed,
    year: Number,

    // 备注数据
    tags: [String],

    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    }
})

// 对数据保存之前中间件的操作
movieSchema.pre('save', function (next) {
    // this 指向 save 存储的实例
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    } else {
        this.meta.updatedAt = Date.now()
    }
    next()
})

mongoose.model('Movie', movieSchema)

