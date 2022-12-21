import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入全局样式
import '@/styles/index.less'
// 2. 引入组件样式
import vant from 'vant'
import 'vant/lib/index.css'
// 引入amfe-flexible用于动态调整rem基准值
import 'amfe-flexible'
// 加载dayjs初始化配置
import '@/utils/dayjs.js'
// 3. 注册你需要的组件
Vue.use(vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
