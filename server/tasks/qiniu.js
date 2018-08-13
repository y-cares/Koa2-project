// 七牛文件   用于存储爬取到的预告片视频信息及相关数据

// 七牛的SDK
const qiniu = require('qiniu')
// 生成随机的id，作为静态资源的文件名
const nanoid = require('nanoid')
const config = require('../config')

const bucket = config.qiniu.bucket
// 客户端上传凭证
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
const cfg = new qiniu.conf.Config()
// 七牛上传对象
const client = new qiniu.rs.BucketManager(mac, cfg)

// 上传七牛的过程
const uploadToQiniu = async (url, key)=> {
    return new Promise((resolve, reject) => {
        client.fetch(url, bucket, key, (err, ret, info) => {
            if (err) {
                reject(err)
            } else {
                if (info.statusCode === 200) {
                    resolve({ key })
                } else {
                    reject(info)
                }
            }
        })
    })
}

;(async () => {
    // 预告片视频信息
    const movies = [{
        // 预告片地址
        video: 'http://vt1.doubanio.com/201808041139/7328a671b34993c1c44144b9e4e0951d/view/movie/M/402340328.mp4',
        // 预告片id 
        doubanId: 27605698,
        // 海报
        poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2529206747.jpg',
        // 视频封面图
        cover: 'https://img3.doubanio.com/img/trailer/medium/2529132152.jpg?1532683675'
    }]
    movies.map(async movie => {
        if (movie.video && !movie.key) {
            try {
                console.log('开始上传 video')
                let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')
                console.log('开始上传 cover')
                let coverData = await uploadToQiniu(movie.cover, nanoid() + '.png')
                console.log('开始上传 poster')
                let posterData = await uploadToQiniu(movie.poster, nanoid() + '.png')

                // key 为上传后的文件资源
                if (videoData.key) movie.videoKey = videoData.key
                if (coverData.key) movie.coverKey = coverData.key
                if (posterData.key) movie.posterKey = posterData.key
                console.log(movie)
                // { video: 'http://vt1.doubanio.com/201808041139/7328a671b34993c1c44144b9e4e0951d/view/movie/M/402340328.mp4',
                //     doubanId: 27605698,
                //     poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2529206747.jpg',
                //     cover: 'https://img3.doubanio.com/img/trailer/medium/2529132152.jpg?1532683675',
                //     videoKey: 'pd7250vyl.bkt.clouddn.com/~ujbv90JPWjZDW~fFrXnO.mp4',
                //     coverKey: 'pd7250vyl.bkt.clouddn.com/wkGXvfAIY6bZ6GFzVLIR2.png',
                //     posterKey: 'pd7250vyl.bkt.clouddn.com/RsUA8abSl9m6aNTqIjOyY.png' }
            } catch (err) {
                console.log(err)
            }
        }
    })
})()

