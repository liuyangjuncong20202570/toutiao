<template>
  <div class="my-container">
    <!-- 已登陆状态 -->
    <div v-if="user" class="header user-info">
      <!-- base-info放用户信息 -->
      <div class="base-info">
        <!-- leftdiv放用户的图片，可以使用vant中的img组件 -->
        <div class="left">
          <van-image round fit="cover" class="avatar" :src="userinfo.photo" />
          <span class="name">{{ userinfo.name }}</span>
        </div>
        <div class="right">
          <van-button to="/user/profile" size="mini" round>编辑资料</van-button>
        </div>
      </div>
      <!-- data-state放用户数据 -->
      <div class="data-states">
        <div class="data-item">
          <span class="count">{{ userinfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userinfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userinfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userinfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- /已登陆状态 -->
    <!-- 未登录状态 -->
    <div v-else class="header no-login">
      <div
        class="login-btn"
        @click="
          $router.push({
            name: 'login',
            query: {
              redirect: '/my'
            }
          })
        "
      >
        <img class="mobile-img" src="@/assets/mobile.png" alt="" />
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <!-- /未登录状态 -->
    <!-- 导航宫格-->
    <van-grid class="grid-nav" :column-num="2" clickable>
      <van-grid-item class="grid-item">
        <template #icon>
          <i class="lyjc lyjc-shoucang"></i>
        </template>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <template #icon>
          <i class="lyjc lyjc-lishi"></i>
        </template>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- /导航宫格 -->
    <van-cell title="消息通知" is-link />
    <van-cell title="小智同学" to="user/chat" is-link class="xiaozhi" />
    <van-cell
      v-if="user"
      @click="onlogout"
      title="退出登录"
      class="quit"
      clickable
    />
    <!-- 通知栏与退出登录 -->
  </div>
</template>

<script>
import { getUserinfo } from '@/api/user.js'
import { mapState } from 'vuex'
import { Dialog } from 'vant'
export default {
  data() {
    return {
      userinfo: ''
    }
  },
  name: 'myIndex',
  computed: {
    ...mapState(['user'])
  },
  created() {
    // 判断是否有user登录
    if (this.user) {
      this.loadUserinfo()
    }
  },
  methods: {
    onlogout() {
      // 推出提示
      // 使用vant的dialog确认弹窗即可
      // 引入 Dialog 组件后，会自动在 Vue 的 prototype 上挂载 $dialog 方法，在所有组件内部都可以直接调用此方法。
      // 也可以通过解构vant库中的dialog来调用
      Dialog.confirm({
        title: '真的要退出吗？'
      })
        .then(() => {
          // on confirm
          // 本地存储中的user值会通过调用setUser函数自动将值设置为null，所以我们只需要将vuex中的值清空即可
          // 清除vuex中的user值
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
        })
      // 点击确认退出时，将本地存储中的和容器中的user清除
    },
    async loadUserinfo() {
      try {
        const {
          data: { data }
        } = await getUserinfo()
        this.userinfo = data
      } catch (error) {
        this.$toast('获取数据失败，请稍后再试')
      }
    }
  }
}
</script>

<style lang="less">
.my-container {
  .header {
    height: 361px;
    // 在css中也可以使用@的位置标识符，但是要在前面加上~
    background: url('~@/assets/banner.png');
    // 以下语句是为了将背景-图片以不拉伸的状态充满整个div
    background-size: cover;
  }
  .no-login {
    // 给手机图标的父盒子设定弹性布局，并且水平垂直居中
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      // 与父盒子设定相同，并且改变图片和文字父盒子的弹性排列顺序改为纵向，这样就在一竖列上
      display: flex;
      justify-content: center;
      align-content: center;
      flex-direction: column;
      .mobile-img {
        width: 132px;
        height: 132px;
      }
      .text {
        margin-top: 15px;
        font-size: 28px;
        color: white;
      }
    }
  }
  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      // flex布局的space-between属性是让内部的元素撑满整个空间
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          display: flex;
          margin-right: 23px;
          border: 1px #fff solid;
        }
        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .data-states {
      // height: 130px; 具体宽度交给子盒子来定义
      // background-color: #ccc;
      // 下面这句样式可以帮助我们将盒子的高度不再计算盒子的内外边距
      // 也就是盒子本身的高度不会再因为内外边距而发生变化了
      box-sizing: border-box;
      display: flex;
      .data-item {
        flex: 1;
        height: 130px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
  .grid-nav {
    .grid-item {
      height: 141px;
      i.lyjc {
        font-size: 45px;
      }
      .lyjc-shoucang {
        color: #eb5253;
      }
      .lyjc-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }
  .quit {
    text-align: center;
    color: #d86262;
  }
  .xiaozhi {
    margin-bottom: 9px;
  }
}
</style>
