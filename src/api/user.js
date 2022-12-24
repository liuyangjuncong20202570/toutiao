// 此模块中用于发起登录请求，首先导入之前封装的axios模块
import request from '@/utils/request.js'

// 封装一个发送请求的参数，之后导入使用,负责获取用户token进行登录
export const login = (data) => {
  return request.post('/v1_0/authorizations', data)
}

// 封装获取短信验证码的模块
// 发送手机号每分钟只发送一次
export const sendMSG = (data) => {
  return request.get(`/v1_0/sms/codes/${data}`)
  // return request({
  //   method: 'GET',
  //   url: `/v1_0/sms/codes/:mobile${mobile}`
  // })
}
// 获取用户信息
export const getUserinfo = () => {
  return request.get('/v1_0/user', {
    // 注意这个接口需要用户的token授权才能访问，该授权的格式是：Bearer token记住Bearer后面的空格不能省且B大写,该配置已在请求拦截器中配置
  })
}
// 获取用户频道数据
export const getUserChannels = () => {
  return request.get('/v1_0/user/channels')
}
