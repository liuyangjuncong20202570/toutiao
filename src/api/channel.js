import request from '@/utils/request.js'
// 获取所有频道
export const getAllchannels = () => {
  return request.get('/v1_0/channels')
}
// 更新已登录用户的频道数据
export const Onlinechannels = (data) => {
  return request.patch('/v1_0/user/channels', {
    channels: [data]
  })
}
// 删除已登录用户的频道数据
export const deleteOnlinechannels = (data) => {
  return request.delete(`/v1_0/user/channels/${data}`)
}
