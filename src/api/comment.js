import request from '@/utils/request.js'
// 用户评论
export const comment = (data) => {
  return request.get('/v1_0/comments', {
    params: data
  })
}
// 给用户评论点赞
export const commentLiking = (target) => {
  return request.post('/v1_0/comment/likings', {
    target
  })
}

// 取消给用户评论的赞
export const cancelcommentLiking = (target) => {
  return request.delete(`/v1_0/comment/likings/${target}`)
}

// 用户发飙评论
export const commentPosting = (target) => {
  return request.post('/v1_0/comments', target)
}
