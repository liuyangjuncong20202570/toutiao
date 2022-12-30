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
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  },
  {
    path: '/artical/:articalId', // 此处路由思路：由于每一篇文章的详情页都不同，所以这里采用动态路由进行跳转
    name: 'artical',
    props: true, // 开启路由传参，将动态参数存入该路由组件的props中
    component: () => import('@/views/artical')
  }
]

const router = new VueRouter({
  routes
})

export default router
