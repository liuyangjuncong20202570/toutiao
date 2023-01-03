<template>
  <div class="edit-gender">
    <van-picker
      title="修改性别"
      show-toolbar
      :columns="columns"
      @confirm="onConfirm"
      @cancel="onCancel"
      :default-index="gender"
    />
  </div>
</template>

<script>
import { changeUserprofile } from '@/api/user-profile.js'
export default {
  props: {
    gender: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      columns: ['男', '女']
    }
  },
  methods: {
    async onConfirm(value, index) {
      this.$toast.loading({
        message: '保存中',
        forbidclick: true
      })
      try {
        await changeUserprofile({ gender: index })
        this.$emit('update:gender', index)
        this.$emit('close')
        this.$toast.success('修改成功')
      } catch (error) {
        this.$toast.fail('修改失败')
      }
    },
    onCancel() {
      this.$emit('close')
    }
  }
}
</script>

<style></style>
