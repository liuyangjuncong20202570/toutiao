<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <van-cell title="全部评论"></van-cell>
    <commentItem
      v-for="(item, index) in list"
      :comment="item"
      :key="index"
      @changeLiking="changeLiking(item, $event)"
      @changecount="changecount(item, $event)"
      @reply-click="$emit('reply-click', $event)"
    ></commentItem>
  </van-list>
</template>

<script>
import commentItem from '@/views/artical/component/comment-item.vue'
import { comment } from '@/api/comment.js'
export default {
  components: { commentItem },
  name: 'commentList',
  data() {
    return {
      loading: false,
      finished: false,
      offset: null, // 页码
      limit: 10 // 每页评论数量
    }
  },
  props: {
    articalId: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'a'
    }
  },
  computed: {
    resList() {
      return this.list
    }
  },
  methods: {
    async onLoad() {
      // 1、通过axios/ajax发送请求获取数据
      const {
        data: { data }
      } = await comment({
        type: this.type,
        source: this.articalId.toString(),
        offset: this.offset,
        limit: this.limit
      })
      const results = data.results
      // 2、将获取的数据添加至list数组中
      // 此处的results不能直接插入list中，应该由数组遍历后一个一个插进去
      this.resList.push(...results)
      // 3、本次数据加载结束之后要把加载状态设置为结束
      this.$emit('total-count', data.total_count)
      this.loading = false
      // 4、判断数据是否全部加载完成
      if (results.length) {
        this.offset = data.last_id
      } else {
        this.finished = true
      }
    },
    changeLiking(item, e) {
      item.is_liking = e
    },
    changecount(item, e) {
      item.like_count = e
    }
  }
}
</script>

<style></style>
