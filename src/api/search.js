// 用户搜索模块
import request from '@/utils/request.js'

// 获取搜索联想
export const getSuggestion = (text) => {
  return request.get('/v1_0/suggestion', {
    params: {
      q: text
    }
  })
}

// 获取搜索结果
export const getResults = (params) => {
  return request.get('/v1_0/search', {
    params
  })
}
