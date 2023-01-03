// import Vue from 'vue' 也可使用vue来定义全局过滤器
import dayjs from 'dayjs'
// 加载中文语言包
import 'dayjs/locale/zh-cn'
// 导入相对时间的插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)
dayjs.locale('zh-cn') // 全局使用
export const time = (val) => {
  return dayjs().to(dayjs(val))
}

export const setTime = (time, val = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(time).format(val)
}
// 定义一个全局过滤器，然后就可以在任何组件的模板中使用了
// 其实过滤器就相当于一个全局可用的方法（仅供模板使用)
// 管道符前面的表达式的结果会作为参数传递到过滤器函数中/过滤器的返回值会渲染到使用过滤器的模板位置
// Vue.filter('relativeTime ', value => {
//   return dayjs().to(dayjs(value))
// })
