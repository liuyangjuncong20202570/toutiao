<template>
  <div class="comment-reply">
    <!-- 头部信息 -->
    <van-nav-bar :title="`${rescomment.reply_count}条回复`">
      <van-icon @click="$emit('close')" slot="left" name="cross"></van-icon>
    </van-nav-bar>
    <!-- /头部信息 -->

    <!-- 当前评论项 -->
    <van-cell>所有评论</van-cell>
    <commentItem :comment="rescomment"></commentItem>
    <!-- /当前评论项 -->
    <!-- 所有评论 -->
    <commentList
      :articalId="rescomment.com_id"
      :type="'c'"
      :list="list"
    ></commentList>
    <!-- /所有评论 -->
    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isPostshow = true"
        >写评论</van-button
      >
    </div>
    <!-- /底部区域 -->
    <!-- 发布回复 -->
    <van-popup v-model="isPostshow" position="bottom">
      <postComment
        :target="rescomment.com_id"
        :art_id="articalId"
        @post-comment="onPost"
      ></postComment>
    </van-popup>
    <!-- /发布回复 -->
  </div>
</template>

<script>
import postComment from '@/views/artical/component/postcomment.vue'
import commentList from '@/views/artical/component/comment-list.vue'
import commentItem from '@/views/artical/component/comment-item.vue'
export default {
  name: 'comment-reply',
  components: {
    commentItem,
    commentList,
    postComment
  },
  data() {
    return {
      isPostshow: false,
      // 在comment-reply这个组件中声明一个空数组，这个数组用来装给评论的回复，之后将这个数组传给comment-list，由comment-list渲染出来评论列表
      list: []
    }
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    articalId: {
      type: [String, Number, Object],
      required: true
    }
  },
  computed: {
    rescomment() {
      return this.comment
    }
  },
  methods: {
    onPost(val) {
      // 将获取的数据放入数据列表最顶层
      this.list.unshift(val)
      // 更新回复数量
      this.rescomment.reply_count++
      // 关闭弹出层
      this.isPostshow = false
    }
  }
}
</script>

<style lang="less" scoped>
.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 88px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 282px;
    height: 46px;
    border: 2px solid #eeeeee;
    font-size: 30px;
    line-height: 46px;
    color: #a7a7a7;
  }
}
</style>
