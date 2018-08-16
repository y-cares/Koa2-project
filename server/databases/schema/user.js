// 用户的模型文件
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
// 建模工具
const Schema = mongoose.Schema
// Mixed 数据类型可存储任何数据，主要用于存储变化比较大的数据
// const Mixed = Schema.Types.Mixed
// 加密的长度，越长代表越复杂
const SALT_WORK_FACTOR = 10
// 最大登录次数
const MAX_LOGIN_ATTEMPTS = 5
// 最大锁定时间
const LOCK_TIME = 2 * 60 * 60 * 1000

const userSchema = new Schema({
    username: {
        // unique 是否设为唯一
        unique: true,
        required: true,
        type: String
    },
    email: {
        unique: true,
        required: true,
        type: String
    },
    password: {
        unique: true,
        type: String
    },
    loginAttempts: {
        type: Number,
        required: true,
        default: 0
    },
    lockUntil: Number,
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

userSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.mow()
    } else {
        this.meta.updatedAt = Date.mow()
    }
    next()
})

// mongoose 虚拟字段，不会存到数据库
// 判断用户是否在锁定期内
userSchema.virtual('isLocked').get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now())
})

userSchema.pre('save', function (next) {
    // isModified 判断某个字段是否被更改
    if (!this.isModified('password')) return next()
    // bcrypt mongoose提供地加盐工具
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err)
        // hash加密
        bcrypt.hash(this.password, salt, (error, hash) => {
            if (error) return next(error)
            this.password = hash
            next()
        })
    })
    next()
})

// 实例方法，
userSchema.method = {
    // 比对密码
    comparePassword: (_password, password) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(_password, password, (err, isMatch) => {
                if (!err) resolve(isMatch)
                else reject(err)
            })
        })
    },
    // incLoginAttepts 判断当前用户是否超过最大登录次数，并锁定
    incLoginAttepts: (user) => {
        return new Promise((resolve, reject) => {
            // 如果被锁定 且 锁定期过了
            if (this.lockUntil && this.lockUntil < Date.now()) {
                this.update({
                    $set: {
                        loginAttempts: 1
                    },
                    $unset: {
                        lockUntil: 1
                    }
                }, (err) => {
                    if (!err) resolve(true)
                    else reject(err)
                })
            } else {
                let updates = {
                    $inc: {
                        loginAttempts: 1
                    }
                }
                // 登录超过最大次数，且没有被锁定
                if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !isLocked) {
                    updates.$set = {
                        lockUntil: Date.now() + LOCK_TIME
                    }
                }
                this.update(update, err => {
                    if (!err) resolve(true)
                    else reject(err)
                })
            }
        })
    }
}

mongoose.model('User', userSchema)

