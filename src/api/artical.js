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
