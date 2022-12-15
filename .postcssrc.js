module.exports = {
  plugins: {
    // vuecli内部已经开启了autoprefixer所以此段代码可省略
    // autoprefixer: {
    //   // 配置要兼容的安卓IOS版本
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    'postcss-pxtorem': {
      // 因为我们是基于lib-flexible做的适配，他的基准值设的是10，所以根据适配性一行分为10份，每份十分之一
      // 所以rootValue应该设计为你初稿的十分之一，原稿宽度是750px，所以rootValue的值应该设为75
      // 但是vant是基于375的宽度设计的，所以应该改为37.5
      // 唯一的缺点就是我们使用初稿计算出来的高度，在代码中使用vant进行描绘时都应该除以2
      // 有没有什么办法可以动态适配？
      //   是自己的元素时返回75
      //   vant组件元素则返回37.5
      //      可以给rootValue写成函数形式，每次页面渲染时都会调用该函数
      //       将该函数中传的值进行解构出file如果file关键字中包含vant则返回37.5，没有则返回75
      rootValue({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      // propsList表示要配置的元素，*表示所有的元素都要做适配
      propList: ['*']
    }
  }
}
