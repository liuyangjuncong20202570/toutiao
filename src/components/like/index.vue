<template>
  <van-icon
    @click="likeArticals"
    :color="value === 1 ? '#ffa500' : ''"
    :name="value === 1 ? 'good-job' : 'good-job-o'"
    :loading="loading"
  />
</template>

<script>
import { articalLike, cancelLike } from '@/api/artical.js'
export default {
  props: {
    value: {
      type: Number,
      required: true
    },
    articalId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async likeArticals() {
      try {
        // 此处status是为了存储表示是否点赞的数字，无感就一直为-1，假如点赞了则为1，之后传给父组件
        let status = -1
        this.loading = true
        if (this.value === 1) {
          // 等于1表示喜欢该篇文章，点击此按钮要取消喜欢
          await cancelLike(this.articalId)
        } else {
          // 反之，要选择喜欢该片文章
          await articalLike(this.articalId)
          status = 1
        }
        this.loading = false
        this.$emit('input', status)
        this.$nextTick(() => {
          this.$toast.success(status === 1 ? '点赞成功' : '取消成功')
        })
      } catch (error) {
        this.$toast.fail('操作失败，请稍后再试')
      }
    }
  }
}
</script>

<style></style>
