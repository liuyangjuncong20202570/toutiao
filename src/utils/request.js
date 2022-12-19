import axios from 'axios'
import store from '@/store'
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net'
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
