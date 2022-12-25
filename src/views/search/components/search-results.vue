<template>
  <div class="search-results">
    <van-list
      :error.sync="error"
      error-text="加载失败，请稍后再试"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getResults } from '@/api/search.js'
export default {
  name: 'SearchResults',
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, // 决定获取数据的页码
      perpage: 20, // 每页数据大小
      error: false
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  methods: {
    onLoad() {
      // onLoad事件运行步骤：
      //   步骤一：获取数据列表
      //   步骤二：将获取的数据插入List中
      //   步骤三：判断是否还有数据
      //          有：则将页码更新为下一页
      //          无：则设置加载结束this.finished = true
      this.getsearchResults()
    },
    async getsearchResults() {
      try {
        const {
          data: { data }
        } = await getResults({
          q: this.searchText,
          page: this.page,
          per_page: this.perpage
        })
        this.list.push(...data.results)
        this.loading = false
        if (data.results.length) {
          this.page += 1
        } else {
          this.finished = true
        }
      } catch (error) {
        this.error = true
        this.loading = false
        this.$toast('加载失败，请稍后再试')
        this.finfished = true
      }
    }
  }
}
</script>

<style></style>
