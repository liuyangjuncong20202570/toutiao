import axios from 'axios'
import store from '@/store'
import JSONBIG from 'json-bigint'
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net',
  // 以下语句是axios内部的让你自定义后端返回的原始数据
  // 因为axios会自动返回json.parse()后端原始数据，所以如果数据超过js的安全数据范围，那么值就不准确
  // 所以此时的art_id也就不是真正的art_id，所以如果让axios在处理后端数据之前就让超过js安全数据范围的值返回json-big.parse()那么这样获取的值就正确
  // 如果没有超过就让他返回正确的值。
  transformResponse: [function(data) {
    try {
      return JSONBIG.parse(data)
    } catch (error) {
      return data
    }
  }]
})
// 配置请求拦截器，给所有的接口在发送请求时配置上headers
request.interceptors.request.use(
  function(config) {
    // 请求发起会经过这里，config为本次请求的配置对象
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // 这里务必要返回config配置对像，否则请求停在这里出不去了
    return config
  },
  function(error) {
    // 该函数主要是有关当请求发送失败（请求还未发送出去）会进入这里
    // 一般不改动此处函数
    return Promise.reject(error)
  }
)
export default request
