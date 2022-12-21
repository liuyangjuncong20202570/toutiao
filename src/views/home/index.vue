<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 标签栏 -->
    <!-- 通过 animated 属性可以开启切换标签内容时的转场动画。 -->
    <!-- 通过 swipeable 属性可以开启滑动切换标签页。 -->
    <!-- 标签组件本身具有的功能就是懒渲染，只有用户第一次查看组件的时候才会渲染上去 -->
    <van-tabs class="channel-tab" v-model="active" animated swipeable>
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
        <!-- 文章列表 -->
        <ArticalList :channel="item"></ArticalList>
      </van-tab>
      <!-- 该元素的作用是汉堡图标的占位符，以免导航栏滑动位移不够出现被图标遮住的情况 -->
      <div class="placeholder" slot="nav-right"></div>
      <div class="hamburger-btn" slot="nav-right">
        <i class="lyjc lyjc-gengduo"></i>
      </div>
    </van-tabs>
    <!-- /标签栏 -->
  </div>
</template>

<script>
import ArticalList from './components/artical-list.vue'
import { getUserChannels } from '@/api/user.js'
export default {
  components: {
    ArticalList
  },
  name: 'homeIndex',
  data() {
    return {
      active: 0,
      channels: ''
    }
  },
  created() {
    this.getUserChannel()
  },
  methods: {
    async getUserChannel() {
      const {
        data: {
          data: { channels }
        }
      } = await getUserChannels()
      this.channels = channels
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  // padding-top的用法是为了让文章内容的文档流向下移动174px，使固定定位的头部导航按不会挡住文章内容
  padding-top: 174px;
  padding-bottom: 100px;
  // 此处注意当style使用scoped的时候相当于给该组件中的每一个元素加上了一个data-v的编号
  // 而不加/deep/相当于是要在满足这个类的同时还要满足有data-v的编号的元素才能实现该样式,明显外部引入的vantage库没有data-v的编号
  // 而加了/deep/的样式相当于变成了后代选择器，也就是说只要父组件(有data-v编号的)中有这个类的元素就能实现该样式
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    color: #fff;
    font-size: 28;
    .van-icon {
      color: #fff;
      font-size: 32px;
    }
  }
  /deep/.channel-tab {
    .van-tabs__wrap {
      // 这个样式是为了使频道栏固定定位，并且为了防止内容无法撑开，要设置left和right为0
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
      .van-tab--active {
        color: #333333;
      }
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777;
    }
    .van-tabs__line {
      // 如果宽度的权重不够可以在其后面添加！important
      width: 31px;
      height: 6px;
      background-color: #3296fa;
      bottom: 8px;
    }
    .van-tabs__nav--line {
      padding-bottom: unset;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      width: 66px;
      height: 82px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      opacity: 0.902;
      i.lyjc {
        font-size: 33px;
      }
      // 对于图标的左边框，这里使用了before伪类，在div前面添加了一个图片，之后再用
      // 定位的方式使其定在左边框位置，至于他的填充模式，选择contain
      // 缩放背景图片以完全装入背景区，可能背景区部分空白。contain 尽可能的缩放背景并保持图像的宽高比例（图像不会被压缩）。该背景图会填充所在的容器。当背景图和容器的大小的不同时，容器的空白区域（上/下或者左/右）会显示由 background-color 设置的背景颜色。
      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url('../../assets/gradient-gray-line.png');
        background-size: contain;
      }
    }
    .placeholder {
      // 由于这个元素的父元素为flex布局，且其兄弟元素都设置了flex-basis也即是它的兄弟元素平分了整个父元素空间
      // 此时如果需要这个元素设置宽度，就需要设置flex-shirink=0默认为1来使它不参与空间平分,使placeholder超出父元素的宽度
      flex-shrink: 0;
      width: 50px;
      height: 82px;
    }
  }
}
</style>
