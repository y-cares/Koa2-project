class Boy {
    @speak
    run () {
        console.log('I can run!')
    }
}

function speak (target, key, descriptor) {
    // target 指的装饰器所紧跟的class或class内部所存在的装饰器
    // key 装饰器在 class 里面所修饰的方法 如 run
    // descriptor 描述 针对一个对象的特定描述 相当于Object.definedProperty的描述
    console.log(target)
    console.log(key)
    console.log(descriptor)

    return descriptor
}

const luke = new Boy()

luke.run()

console.log('-------------------------------------------------------')

// 若觉得自带的三个属性不够用，可自定义属性，以fn的形式返回出去
class Boys {
    @speaks('中文')
    run () {
      console.log('I can speak ' + this.language)
      console.log('I can run!')
    }
  }
  
  function speaks (language) {
    return function (target, key, descriptor) {
      console.log(target)
      console.log(key)
      console.log(descriptor)
  
      target.language = language
  
      return descriptor
    }
  }
  
  const lukes = new Boys()
  
  lukes.run()
