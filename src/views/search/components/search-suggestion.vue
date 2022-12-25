<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(item, index) in options"
      :key="index"
      icon="search"
      @click="$emit('search', item)"
    >
      <div slot="title" v-html="highlight(item)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSuggestion } from '@/api/search.js'
// 按需加载的好处：只会导入所需的方法
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  data() {
    return {
      options: []
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  watch: {
    searchText: {
      // debounce函数：
      // 参数一：是防抖执行函数
      // 参数二：要延迟的时间
      // 参数三：延迟后的执行函数
      // 只要一直输入值就会一直延迟1s直到停止输值超过1s就会执行函数
      handler: debounce(function (newVal) {
        this.loadSuggestion(newVal)
      }, 200),
      // 该回调会在调用该组件后立即触发
      immediate: true
    }
  },
  methods: {
    highlight(val) {
      // 正则表达式中的//字符中间的内容都会当作匹配字符来使用,而不是数据来使用
      // 如果要使用动态数据，则需要手动创建一个new RegExp来使用
      // RegExp正则表达式构造函数
      //   参数一：为匹配模式字符串，会根据该参数创建正则表达式，可以填入字符串、动态数据
      //   参数二：为匹配模式，必须写在字符串中。
      try {
        const reg = new RegExp(this.searchText, 'gi')
        return val.replace(
          reg,
          `<span style='color:#3296fa'>${this.searchText}</span>`
        )
      } catch (error) {}
    },
    async loadSuggestion(val) {
      try {
        const {
          data: {
            data: { options }
          }
        } = await getSuggestion(val)
        this.options = options
      } catch (error) {
        this.$toast('数据获取失败，请稍后再试')
      }
    }
  }
}
</script>

<style></style>
