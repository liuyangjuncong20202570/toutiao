import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage.js'
Vue.use(Vuex)
const TOKEN_KEY = 'TOUTIAO_USER'
export default new Vuex.Store({
  state: {
    // user中存储的是数据信息，里面装的是用户token等数据信息，user为一个对象
    // 此时为了让vuex中的数据也保证持久化，所以我们可以将本地存储中的值给user
    // 此步骤中为什么要给TOKEN_KEY设置一个常量，就是为了防止万一本地存储中获取数据时把键给写错了，万一写错了程序会报错，方便检查
    // 因为本地存储中存储的是json格式，所以在给user赋值时要把格式转换回来
    user: getItem(TOKEN_KEY),
    channels: [],
    searchHistories: getItem('TOUIAO_HISTORIES') || [], // 搜索记录数组
    cachePages: ['layoutIndex']
  },
  getters: {},
  mutations: {
    // 通过setUser函数来改变user的值
    setUser(state, payload) {
      state.user = payload
      // 此处为了防止页面刷新将数据丢失，我们这里选择将数据存至本地存储实现持久化
      setItem(TOKEN_KEY, state.user)
    },
    getChannels(state, payload) {
      state.channels = payload
    },
    updateChannels(state, payload) {
      state.channels.push(payload)
    },
    removeChannels(state, payload) {
      state.channels.splice(payload, 1)
    },
    setsearchHistories(state, payload) {
      state.searchHistories.unshift(payload)
    },
    removesearchHistories(state, payload) {
      state.searchHistories.splice(payload, 1)
    },
    deleteAllhistories(state) {
      state.searchHistories = []
    },
    // 添加缓存组件
    addcachePage(state, pageName) {
      // 只要cachePages中未含有pageName那么我们就把他插入到缓存数组中
      if (!state.cachePages.includes(pageName)) {
        state.cachePages.push(pageName)
      }
    },
    // 移除缓存组件
    deletecachePage(state, pageName) {
      const index = state.cachePages.indexOf(pageName)
      // 只要在cachePages中找到了该组件，那么我们就把它移除出缓存数组中
      if (index !== -1) {
        state.cachePages.splice(index, 1)
      }
    }
  },
  actions: {},
  modules: {}
})
