<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      @click-left="$router.back()"
      title="黑马头条"
      left-arrow
    >
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="list.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ list.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="list.aut_photo"
          />
          <div slot="title" class="user-name">{{ list.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ getTime(list.pubdate) }}
          </div>
          <!-- 在组件内部使用v-model可以简便子组件需要更改props数据的方法 -->
          <!-- 如果在组件内部使用v-model会自动向子组件传递一个props值：value，并且它的值等于v-model的值 -->
          <!-- 并且组件会自动监听一个input事件，并且将value的值=$event的值 -->
          <!--使用组件时： v-model=list.is_followed -->
          <!--子组件内部props： value=list.is_followed -->
          <!-- 子组件自动监听input事件：@input:list.is_followed=$event -->
          <subscribeUser
            class="follow-btn"
            :userId="list.aut_id"
            v-model="list.is_followed"
          ></subscribeUser>
          <!-- <van-button
            class="follow-btn"
            :type="list.is_followed ? 'default' : 'info'"
            color="#3296fa"
            :loading="isLoading"
            round
            size="small"
            :icon="list.is_followed ? '' : 'plus'"
            @click="onFollow"
            >{{ list.is_followed ? '已关注' : '关注' }}</van-button
          > -->
          <!-- <van-button
            class="follow-btn"
            round
            size="small"
          >已关注</van-button> -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content"
          ref="articalcontent"
          v-html="list.content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 关于此处底部区域，应该在整个页面文章主体都渲染完成后，也就是请求发起成功后才显示底部栏 -->
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn" type="default" round size="small"
            >写评论</van-button
          >
          <van-icon name="comment-o" badge="123" color="#777" />
          <!-- 收藏 -->
          <collectArtical
            :articalId="list.art_id"
            v-model="list.is_collected"
          ></collectArtical>
          <!-- 喜欢 -->
          <likeArtical
            :articalId="list.art_id"
            v-model="list.attitude"
          ></likeArtical>
          <!-- 不喜欢 -->
          <dislikeArtical
            :articalId="list.art_id"
            v-model="list.attitude"
          ></dislikeArtical>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button @click="getDetails" class="retry-btn">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
  </div>
</template>

<script>
import dislikeArtical from '@/components/dislike'
import likeArtical from '@/components/like'
import collectArtical from '@/components/collect-artical'
import subscribeUser from '@/components/subscribeUser'
import { time } from '@/utils/dayjs.js'
import { getArticalDetails } from '@/api/artical.js'
import { ImagePreview } from 'vant'
export default {
  components: { subscribeUser, collectArtical, likeArtical, dislikeArtical },
  name: 'ArticleIndex',
  props: {
    articalId: {
      type: [Number, String, Object], // 关于为什么是数字或字符串类型，如果是通过新闻列表跳进来的则是数字类型，如果通过URL地址栏直接访问则是字符串类型
      required: true
    }
  },
  data() {
    return {
      list: {},
      loading: true,
      errStatus: 0, // 错误状态码
      isLoading: false // 默认关注按钮的加载状态为false
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getDetails()
  },
  mounted() {},
  methods: {
    async getDetails() {
      // 为了实现，当点击重试按钮时，可以显示加载状态并且重新发起请求，我们应该在发送请求方法一开始就让loading为true，让其转起来
      this.loading = true
      try {
        const {
          data: { data }
        } = await getArticalDetails(this.articalId)
        this.list = data
        this.loading = false
        // 注意，数据影响视图（DOM数据发生变化）不是立即的
        // 如果需要马上操作发生变化的DOM节点，需要把代码发到this.$nextTick()
        // 中执行，此方法是vue中独有的
        this.$nextTick(() => {
          this.handlePreview()
        })
      } catch (error) {
        this.loading = false // 加载失败后也要使加载结束
        if (error.response && error.response.status === 404) {
          this.errStatus = 404
        }
      }
    },
    // 用于处理图片预览函数
    handlePreview() {
      // 获取文章内容的DOM容器
      const articalContent = this.$refs.articalcontent
      // 得到所有的img标签
      const images = articalContent.querySelectorAll('img')
      const imagesPath = []
      // 循环img列表，给img注册点击事件
      images.forEach((item, index) => {
        imagesPath.push(item.src)
        item.addEventListener('click', () => {
          ImagePreview({
            images: imagesPath,
            startPosition: index
          })
        })
      })
      // 在事件处理函数中调用imagePreview（）预览函数
    },
    getTime(val) {
      return time(val)
    }
  }
}
</script>

<style scoped lang="less">
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

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
    /deep/ .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
