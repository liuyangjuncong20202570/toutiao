<template>
  <div class="postcomment">
    <!--左侧评论区-->
    <van-field
      v-model="message"
      rows="5"
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <!--/左侧评论区-->
    <!-- 右侧发表按钮 -->
    <van-button size="small" :disabled="!message" @click="onPost"
      >发表</van-button
    >
    <!-- /右侧发表按钮 -->
  </div>
</template>

<script>
import { commentPosting } from '@/api/comment.js'
export default {
  data() {
    return {
      message: ''
    }
  },
  props: {
    // 如果发表文章回复，则只需要传递一个文章ID
    // 如果发表评论恢复，则需要传递一个文章ID和评论ID
    target: {
      type: [Number, String, Object],
      required: true
    },
    art_id: {
      type: [Number, String, Object],
      default: null
    }
  },
  methods: {
    async onPost() {
      this.$toast.loading({
        message: '发表中...',
        forbidClick: true
      })
      const { data } = await commentPosting({
        target: this.target.toString(),
        content: this.message,
        art_id: this.art_id === null ? null : this.art_id.toString()
      })
      this.$emit('post-comment', data.data.new_obj)
      this.$toast.success('发表成功')
      this.message = ''
    }
  }
}
</script>

<style lang="less" scoped>
.postcomment {
  padding: 14px;
  display: flex;
  align-items: center;
}
</style>
