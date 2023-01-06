<template>
  <div id="app">
    <!-- 条件缓存，仅缓存layoutindex这个组件，其他组件不缓存 -->
    <keep-alive :include="cachePages">
      <!-- keepalive组件可以帮助我们将由于路由切换导致的销毁的组件进行缓存，从而保证组件能够保存数据 -->
      <!-- 但是有可能会导致组件的生命周期函数不再触发 -->
      <router-view />
    </keep-alive>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: { ...mapState(['cachePages']) },
  name: 'App'
}
</script>
<style lang="less"></style>
