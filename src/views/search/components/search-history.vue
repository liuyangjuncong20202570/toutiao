<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteshow">
        <span @click="deleteAll">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteshow = !isDeleteshow">完成</span>
      </div>
      <van-icon
        v-else
        @click="isDeleteshow = !isDeleteshow"
        name="delete"
      ></van-icon>
    </van-cell>
    <van-cell
      v-for="(item, index) in searchHistories"
      :key="index"
      :title="item"
      @click="searchItem(item, index)"
    >
      <van-icon v-show="isDeleteshow" name="close"></van-icon>
    </van-cell>
  </div>
</template>

<script>
import { setItem } from '@/utils/storage.js'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      isDeleteshow: false
    }
  },
  // Prop数据
  // Prop是受父组件数据影响的
  // 如果是普通数据（数字、字符串、布尔值）绝对不能修改即便改了也不会传导给父组件
  // 如果是引用类型数据（数组、对象)
  // 可以修改，例如[ ].push(xxx)，对象.XXX = XXX,不能重新喊值:xxx=[]
  name: 'SearchHistory',
  methods: {
    searchItem(item, index) {
      if (this.isDeleteshow) {
        // 删除操作，将历史记录数组中的数据删除
        // this.searchHistories.splice()
        this.$store.commit('removesearchHistories', index)
      } else {
        // 非删除操作，点击历史记录为搜索该词条
        this.$emit('searchHistoryitem', item)
      }
    },
    deleteAll() {
      this.$store.commit('deleteAllhistories')
    }
  },
  computed: {
    ...mapState(['searchHistories'])
    // monitor() {
    //   return this.$store.state.searchHistories
    // }
  },
  watch: {
    '$store.state.searchHistories': {
      handler(newVal) {
        setItem('TOUIAO_HISTORIES', newVal)
      },
      immediate: true
    }
  }
}
</script>

<style></style>
