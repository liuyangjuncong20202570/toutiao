<template>
  <div class="edit-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="修改生日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { changeUserprofile } from '@/api/user-profile.js'
export default {
  props: {
    value: {
      type: [String, Object, Date, Number],
      required: true
    }
  },
  data() {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      // 日期对象的括号中也能通过传递字符串来获取数字对象
      currentDate: new Date(this.value)
    }
  },
  methods: {
    async onConfirm(value) {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true
      })
      try {
        await changeUserprofile({ birthday: dayjs(value).format('YYYY-MM-DD') })
        this.$emit('close')
        this.$emit('input', dayjs(value).format('YYYY-MM-DD'))
        this.$toast.success('保存成功')
      } catch (error) {
        this.$toast.fail('保存失败')
      }
    }
  }
}
</script>

<style></style>
