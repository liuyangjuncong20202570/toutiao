// 获取文章数据接口
import request from '@/utils/request.js'

export const getArticals = (data) => {
  return request.get('/v1_0/articles', {
    params: {
      channel_id: data.id,
      timestamp: data.time
    }
  })
}

// 获取文章详情页
export const getArticalDetails = (data) => {
  return request.get(`/v1_0/articles/${data}`)
}

// 收藏文章
export const collectArticals = (target) => {
  return request.post('/v1_0/article/collections', {
    target
  })
}

// 取消文章收藏
export const deleteCollect = (target) => {
  return request.delete(`/v1_0/article/collections/${target}`)
}

// 文章点赞
export const articalLike = (target) => {
  return request.post('/v1_0/article/likings', {
    target
  })
}

// 取消文章点赞
export const cancelLike = (target) => {
  return request.delete(`/v1_0/article/likings/${target}`)
}

// 文章不喜欢
export const articaldisLike = (target) => {
  return request.post('/v1_0/article/dislikes', {
    target
  })
}

// 取消文章不喜欢
export const canceldisLike = (target) => {
  return request.delete(`/v1_0/article/dislikes/${target}`)
}
