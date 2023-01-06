<template>
  <div class="layout-container">
    <!-- 此处加上keepalive是为了缓存二级路由，要不然只有一级路由在切换时才会缓存 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!-- 子路由出口 -->
    <!-- tabbar标签栏 -->
    <!-- route  和 replace to的作用是vant开启路由模式 -->
    <!-- 开启路由模式后，控制底部标签栏的高亮是靠路径而不是v-model=“active”，并且每次刷新tabbar所在的位置仍是原来位置而不会回到第一个页面 -->
    <van-tabbar route class="layout-tabbar">
      <van-tabbar-item to="/home">
        <span class="text">首页</span>
        <template #icon>
          <i class="lyjc lyjc-shouye"></i>
        </template>
      </van-tabbar-item>

      <van-tabbar-item to="/qa">
        <span class="text">问答</span>
        <template #icon>
          <i class="lyjc lyjc-wenda"></i>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/video">
        <span class="text">视频</span>
        <template #icon>
          <i class="lyjc lyjc-shipin"></i>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/my">
        <span v-if="user" class="text">我的</span>
        <span v-else class="text">未登录</span>
        <template #icon>
          <i class="lyjc lyjc-wode"></i>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'layoutIndex',
  computed: {
    ...mapState(['user'])
  },
  data() {
    return {}
  },
  methods: {},
  mounted() {
    this.$store.commit('addcachePage', 'layoutIndex')
  }
}
</script>

<style lang="less" scoped>
.layout-container {
  .layout-tabbar {
    i.lyjc {
      font-size: 40px;
    }
    span.text {
      font-size: 20px;
    }
  }
}
</style>
