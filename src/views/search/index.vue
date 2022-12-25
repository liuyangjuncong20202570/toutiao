<template>
  <div class="search-container">
    <!-- 搜索框 -->
    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form class="search" action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        background="#3296fa"
        @focus="isResultsshow = false"
      />
    </form>
    <!-- /搜索框 -->

    <!-- 此处逻辑很重要，先结果再联想后记录，当结果没有的情况下才显示联想或记录 -->
    <!-- 搜索结果 -->
    <SearchResults
      :searchText="searchText"
      v-if="isResultsshow"
    ></SearchResults>
    <!-- /搜索结果 -->

    <!-- 搜索联想 -->
    <SearchSuggestion
      :searchText="searchText"
      v-else-if="searchText"
      @search="onSearch"
    ></SearchSuggestion>
    <!-- /搜索联想 -->

    <!-- 搜索记录 -->
    <SearchHistory
      @searchHistoryitem="searchHistoryitem"
      v-else
    ></SearchHistory>
    <!-- /搜索记录 -->
  </div>
</template>

<script>
import SearchHistory from './components/search-history.vue'
import SearchSuggestion from './components/search-suggestion.vue'
import SearchResults from './components/search-results.vue'
import { mapState } from 'vuex'
export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResults
  },
  data() {
    return {
      searchText: '',
      isResultsshow: false // 控制搜索结果的展示
    }
  },
  methods: {
    onSearch(val) {
      // 这一步的理由是为了当用户点击了联想记忆时，可以让文本框中的数据也变为联想记忆中的数据
      this.searchText = val
      // 应该在渲染搜索结果之前将搜索历史存储到searchHistories中
      // 要求：不要有重复记录、最新的排在最前面
      // 利用数组的indexOf方法，判断该数据的索引是否存在，有则返回索引，无则返回-1
      const index = this.searchHistories.indexOf(val)
      if (index === -1) {
        this.$store.commit('setsearchHistories', val)
      } else {
        this.$store.commit('removesearchHistories', index)
        this.$store.commit('setsearchHistories', val)
      }
      this.isResultsshow = true
    },
    searchHistoryitem(val) {
      this.onSearch(val)
    },
    onCancel() {
      this.$router.back()
    }
  },
  computed: {
    ...mapState(['searchHistories'])
  }
}
</script>

<style lang="less" scoped>
.search-container {
  // 这个样式是为了不让内部数据列表因为搜索栏固定定位脱离文档流被挡住而写的
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
