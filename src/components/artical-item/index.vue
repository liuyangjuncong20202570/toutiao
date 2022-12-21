<template>
  <van-cell class="articalItem">
    <div slot="title" class="title van-multi-ellipsis--l2">
      {{ artical.title }}
    </div>
    <div slot="label" class="label">
      <div v-if="artical.cover.type === 3" class="img-wraper">
        <van-image class="imgItem" :src="artical.cover.images[0]" />
        <van-image class="imgItem" :src="artical.cover.images[1]" />
        <van-image class="imgItem" :src="artical.cover.images[2]" />
      </div>
      <div class="label-wraper">
        <span>{{ artical.aut_name }}</span>
        <span>{{ artical.comm_count }}评论</span>
        <span>{{ getTime(artical.pubdate) }}</span>
      </div>
    </div>
    <van-image
      v-if="artical.cover.type === 1"
      fit="cover"
      slot="default"
      class="right-cover"
      :src="artical.cover.images[0]"
    />
  </van-cell>
</template>

<script>
import { time } from '@/utils/dayjs'
export default {
  name: 'ArticalItem',
  props: {
    artical: {
      type: Object,
      required: true
    }
  },
  methods: {
    // 也可以使用全局过滤器来达到效果,但不建议因为vue3已经取消过滤器
    getTime(val) {
      return time(val)
    }
  }
}
</script>

<style lang="less" scoped>
.articalItem {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }
  // 将左侧图片固定高宽,让右侧文字平分剩余flex空间
  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }
  .right-cover {
    width: 232px;
    height: 146px;
  }
  .label-wraper {
    span {
      font-size: 22px;
      color: #b4b4b4;
      margin-right: 25px;
    }
  }
  .img-wraper {
    padding: 30px 0;
    display: flex;
    .imgItem {
      flex: 1;
      height: 146px;
      width: 100%;
      &:not(:last-of-type) {
        padding-right: 4px;
      }
    }
  }
}
</style>
