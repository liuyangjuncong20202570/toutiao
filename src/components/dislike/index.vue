<template>
  <van-icon
    class="dislike"
    @click="dislikeArticals"
    :color="value === 0 ? '#DB4437' : ''"
    :name="value === 0 ? 'good-job' : 'good-job-o'"
    :loading="loading"
  />
</template>

<script>
import { articaldisLike, canceldisLike } from '@/api/artical.js'
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
    async dislikeArticals() {
      let status = -1
      this.loading = true
      try {
        if (this.value === 0) {
          // 等于0说明不喜欢该篇文章，点击此按钮要取消不喜欢
          await canceldisLike(this.articalId)
        } else {
          // 不等于0说明现在要开始不喜欢这篇文章了
          await articaldisLike(this.articalId)
          status = 0
        }
        this.loading = false
        this.$emit('input', status)
        this.$nextTick(() => {
          this.$toast.success(this.value === 0 ? '收到反馈' : '已取消不喜欢')
        })
      } catch (error) {
        this.$toast.fail('操作失败，请稍后再试')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.dislike {
  transform: rotateX(180deg);
}
</style>
