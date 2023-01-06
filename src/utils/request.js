import axios from 'axios'
import store from '@/store'
import JSONBIG from 'json-bigint'
import { Toast } from 'vant'
import router from '@/router'

// 此处的refreshToken是专门用来帮用户通过refreshToken获取新的token，创建新的axios实例是为了防止请求再次经过拦截器
const refeshToken = axios.create({
  baseURL: 'http://toutiao.itheima.net'
})

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
// 配置响应拦截器
request.interceptors.response.use(function(response) {
  // 任何状态码为2xx的都会进入成功代码
  return response
}, async function(error) {
  // 任何状态码不为2xx的错误状态码都会进入错误阶段
  // Do something with response error
  const status = error.response.status
  if (status === 400) {
  //  客户端请求参数错误
    Toast.fail('客户端请求参数错误')
  } else if (status === 401) {
    // token无效
    const { user } = store.state
    if (!user.token || !user) {
      // 判断是否有token，没有就直接跳转到登陆页面
      return redirectLogin()
    }

    try {
      // 这里开始刷新token
      // axios的请求有三个参数：axios.get('url',data,config) Headers属于config配置项，所以如果放第二个{}中它会默认配置到data中去
      // 所以我们应该放到第三个配置项config中去，至于params可以放到url中用字符串拼接使用
      const { data: { data } } = await refeshToken.put('/v1_0/authorizations', {}, {
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      user.token = data.token
      store.commit('setUser', user)
      // error.coonfig中存储的是发送失败的请求信息，当获取到新的token之后要让请求再发送一次，此时走request请求，此时就可以成功获取数据了
      return request(error.config)
    } catch (error) {
      // 连刷新token都失败了，说明只能去登录了
      return redirectLogin()
    }
  } else if (status === 403) {
    // 没有权限操作
    Toast.fail('权限不足，无法操作')
  } else if (status >= 500) {
    // 服务端错误
    Toast.fail('服务端错误')
  }
  return Promise.reject(error)
})

function redirectLogin() {
  router.replace({
    name: 'login',
    // 此处的router.currentRoute就相当于组件中的this.$router将跳转过来的路径作为查询参数传递给login页面
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}
export default request
