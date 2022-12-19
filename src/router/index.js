import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  // 给APP.Vue配置一个父路由，用于加载页面底部tabbar
  {
    path: '/',
    // name: 'layout',如果父路由有默认子路由那么它的name属性没有意义，因为它会自动跳到它的默认子路由当中
    component: () => import('@/views/layout'),
    redirect: '/home',
    children: [
      {
        path: '/home', // 默认子路由
        name: 'homeIndex',
        component: () => import('@/views/home')
      },
      {
        path: 'qa',
        name: 'qaIndex',
        component: () => import('@/views/qa')
      },
      {
        path: 'video',
        name: 'videoIndex',
        component: () => import('@/views/video')
      },
      {
        path: 'my',
        name: 'myIndex',
        component: () => import('@/views/my')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
