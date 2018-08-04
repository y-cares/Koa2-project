// 同步
const doSync = (sth, time) => new Promise(resolve => {
    setTimeout(() => {
        console.log(`${sth}用了${time}毫秒`)
        resolve()
    }, time)
})
// 异步
const doAsync = (sth, time, cb) => {
    setTimeout(() => {
        console.log(`${sth}用了${time}毫秒`)
        cb && cb()        
    }, time)
}
// 其他情况
const doElse = sth => console.log(sth)

const Scott = {doSync, doAsync, doElse}
const Meizi = {doSync, doAsync, doElse}

;(async () => {
    // 模拟同步阻塞
    console.log('case 1: 妹子来到门口')
    await Scott.doSync('Scott 在刷牙', 1000)
    console.log('妹子啥也没干，一直等')
    await Meizi.doSync('妹子洗澡', 2000)
    Meizi.doElse('妹子去忙别的了')  

    // 模拟异步非阻塞
    console.log('case 3: 妹子来到门口按下通知开关')
    Scott.doAsync('Scott 在刷牙', 1000, () => {
        console.log('卫生间通知妹子来洗澡')
        Meizi.doAsync('妹子洗澡', 2000)
    })
    Meizi.doElse('妹子去忙别的了')  
})()