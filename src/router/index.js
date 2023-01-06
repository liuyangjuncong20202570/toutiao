import Vue from 'vue'
import VueRouter from 'vue-router'
import { Dialog } from 'vant'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    // meta是路由元信息，可以通过增加这个属性在配置导航守卫时可以方便统计
    meta: { requiresAuth: false }
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
        component: () => import('@/views/home'),
        meta: { requiresAuth: false }
      },
      {
        path: 'qa',
        name: 'qaIndex',
        component: () => import('@/views/qa'),
        meta: { requiresAuth: false }
      },
      {
        path: 'video',
        name: 'videoIndex',
        component: () => import('@/views/video'),
        meta: { requiresAuth: false }
      },
      {
        path: 'my',
        name: 'myIndex',
        component: () => import('@/views/my'),
        meta: { requiresAuth: false }
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search'),
    meta: { requiresAuth: false }
  },
  {
    path: '/artical/:articalId', // 此处路由思路：由于每一篇文章的详情页都不同，所以这里采用动态路由进行跳转
    name: 'artical',
    props: true, // 开启路由传参，将动态参数存入该路由组件的props中
    component: () => import('@/views/artical'),
    meta: { requiresAuth: false }
  },
  {
    path: '/user/profile', // 此处路由思路：由于每一篇文章的详情页都不同，所以这里采用动态路由进行跳转
    name: 'userProfile',
    component: () => import('@/views/user-profile'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/chat', // 此处路由思路：由于每一篇文章的详情页都不同，所以这里采用动态路由进行跳转
    name: 'userChat',
    component: () => import('@/views/user-chat'),
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (store.state.user) {
    return next()
  } else {
    if (to.meta.requiresAuth) {
      Dialog.confirm({
        title: '确认登录',
        message: '该功能需要登录才能使用，确认登录吗？'
      })
        .then(() => {
        // on confirm
        // 点击确认后，如果没有进行登录则跳转到登录页面，并且向登陆页面传递之前的跳转路径，以便登录成功后跳转回原先路径
          router.replace({
            name: 'login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          })
        })
        .catch(() => {
        // on cancel
          next(false)
        })
    } else {
      next()
    }
  }
})

export default router
