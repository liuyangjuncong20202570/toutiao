<template>
  <div class="edit-name">
    <van-nav-bar
      title="修改昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <!-- 输入框 -->
    <div class="name-field">
      <van-field
        v-model="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="10"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
    <!-- /输入框 -->
  </div>
</template>

<script>
import { changeUserprofile } from '@/api/user-profile.js'
export default {
  data() {
    return {
      message: this.value
    }
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  name: 'EditName',
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true
      })
      try {
        await changeUserprofile({ name: this.message })
        this.$emit('input', this.message)
        this.$emit('close')
        this.$toast.success('修改成功')
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.$toast.fail('该昵称已存在')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.name-field {
  padding: 10px;
}
</style>
