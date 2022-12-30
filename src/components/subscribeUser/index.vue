<template>
  <van-button
    class="follow-btn"
    :type="value ? 'default' : 'info'"
    color="#3296fa"
    :loading="isLoading"
    round
    size="small"
    :icon="value ? '' : 'plus'"
    @click="onFollow"
    >{{ value ? '已关注' : '关注' }}</van-button
  >
</template>

<script>
import { subscribeUser, unsubscribeUser } from '@/api/user.js'
export default {
  data() {
    return {
      isLoading: false,
      list: {}
    }
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    userId: {
      required: true,
      type: [Number, String, Object]
    }
  },
  methods: {
    async onFollow() {
      try {
        if (this.value) {
          this.isLoading = true
          await unsubscribeUser(this.userId)
        } else {
          this.isLoading = true
          await subscribeUser(this.userId)
        }
        this.$emit('input', !this.value)
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.$toast('用户无法关注自己')
        }
        this.$toast('您还未登录，快去登陆吧')
      }
      this.isLoading = false
    }
  }
}
</script>

<style></style>
