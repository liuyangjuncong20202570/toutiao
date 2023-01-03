import request from '@/utils/request.js'

// 获取用户信息
export const getUserprofile = () => {
  return request.get('/v1_0/user/profile')
}

// 更改用户个人信息
export const changeUserprofile = (data) => {
  return request.patch('/v1_0/user/profile', data)
}

// 修改用户头像
export const changeUserphoto = (data) => {
  return request.patch('/v1_0/user/photo', data)
}
