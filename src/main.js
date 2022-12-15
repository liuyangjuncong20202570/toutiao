import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/styles/index.less'
import vant from 'vant'
import 'vant/lib/index.css'
// 2. 引入组件样式
Vue.use(vant)

// 3. 注册你需要的组件

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
