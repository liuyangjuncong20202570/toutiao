<template>
  <van-cell class="comment-item">
    <van-image
      class="avatar"
      slot="icon"
      fit="cover"
      round
      :src="comment.aut_photo"
    />
    <div slot="title">
      <div class="title-wrap">
        <div class="name">{{ comment.aut_name }}</div>
        <!-- 右侧点赞小手 -->
        <div class="like-wrap" @click="like">
          <van-icon
            class="like-icon"
            :name="comment.is_liking ? 'good-job' : 'good-job-o'"
            :color="comment.is_liking ? '#FE80B6' : ''"
          ></van-icon>
          <span class="like-count">{{ comment.like_count }}</span>
        </div>
      </div>
      <div class="content">
        {{ comment.content }}
      </div>
      <div class="buttom">
        <span class="pubdate">{{
          pubdate(comment.pubdate, 'MM:DD HH:mm')
        }}</span>
        <van-button
          class="replay-btn"
          round
          size="mini"
          @click="$emit('reply-click', comment)"
          >{{ comment.reply_count }} 回复</van-button
        >
      </div>
    </div>
  </van-cell>
</template>

<script>
import { commentLiking, cancelcommentLiking } from '@/api/comment.js'
import { setTime } from '@/utils/dayjs.js'
export default {
  methods: {
    pubdate(val1, val2) {
      return setTime(val1, val2)
    },
    async like() {
      const commentId = this.comment.com_id.toString()
      if (this.comment.is_liking) {
        // 为真说明已经点赞再次点击想要取消点赞
        await cancelcommentLiking(commentId)
        this.$emit('changecount', this.comment.like_count - 1)
      } else {
        // 否则想要点赞
        await commentLiking(commentId)
        this.$emit('changecount', this.comment.like_count + 1)
      }
      this.$emit('changeLiking', !this.comment.is_liking)
    }
  },
  name: 'commentItem',
  props: {
    comment: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.comment-item {
  /deep/ .avatar {
    width: 50px;
    height: 50px;
    margin-right: 13px;
  }
  .name {
    font-size: 14px;
    color: #406599;
  }
  .content {
    font-size: 30px;
    color: #222222;
  }
  .pubdate {
    font-size: 10px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
  }
  .buttom {
    display: flex;
    align-items: center;
  }
  .like-wrap {
    display: flex;
    align-items: center;
  }
  .replay-btn {
    margin-left: 10px;
  }
}
</style>
