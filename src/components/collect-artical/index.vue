<template>
  <van-icon
    @click="collectArticals"
    :color="value ? '#ffa500' : ''"
    :name="value ? 'star' : 'star-o'"
    :loading="loading"
  />
</template>

<script>
import { collectArticals, deleteCollect } from '@/api/artical.js'
export default {
  props: {
    value: {
      type: Boolean,
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
    async collectArticals() {
      try {
        this.loading = true
        if (this.value) {
          // 已收藏文章，点击该按钮的目的是为了取消收藏
          await deleteCollect(this.articalId)
        } else {
          // 反之，未收藏，点击此按钮是为了收藏文章
          await collectArticals(this.articalId)
        }
        this.loading = false
        this.$emit('input', !this.value)
        // 自定义事件修改数据并不是实时更新的
        this.$nextTick(() => {
          this.$toast.success(this.value ? '收藏成功' : '取消成功')
        })
      } catch (error) {
        this.$toast.fail('操作失败，请稍后再试')
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
