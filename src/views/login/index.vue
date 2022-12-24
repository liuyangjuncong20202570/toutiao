<template>
  <div class="login-container">
    <!-- 登录导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="登录"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 登录表单 -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormrule.mobile"
        type="number"
        maxlength="11"
      >
        <!-- 利用插槽自定义左方图标 -->
        <template #left-icon>
          <i class="lyjc lyjc-shouji"></i>
        </template>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormrule.code"
        type="number"
        maxlength="6"
      >
        <!-- 利用插槽自定义左方图标 -->
        <template #left-icon>
          <i class="lyjc lyjc-yanzhengma"></i>
        </template>
        <!-- 利用button插槽在输入框尾部插入短信验证码功能 -->
        <template #button>
          <!-- finish事件可以规定一个当倒计时结束后触发某个事件，在这里，我们将倒计时结束后将变量isCountdown设置为false形成重新获取验证码的效果 -->
          <!-- vant中如果native-type不为button则所有按钮都会触发表单提交事件，所以我们要给点击发送验证码的按钮添加一个native-type的属性 -->
          <van-count-down
            v-if="isCountDown"
            :time="1000 * 60"
            format="ss s后重新获取"
            @finish="isCountDown = false"
          />
          <van-button
            v-else
            native-type="button"
            @click="sendSMS"
            class="sendMSG"
            round
            size="small"
            type="default"
            >获取验证码</van-button
          >
        </template>
      </van-field>

      <div class="loginButton">
        <van-button
          ref="btn"
          class="loginButton-btn"
          block
          type="info"
          native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendMSG } from '@/api/user.js'
export default {
  name: 'Loginindex',
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      userFormrule: {
        // vant中定义的rules为一个数组，里面可以装多个形式为对象的验证规则，对象中第一个键值对表示验证规则，第二个键值对表示提示信息
        // 2表单验证
        //   使用vant自带的rules验证规则给vant-field进行表单验证
        //    当表单提交的时候会自动触发表单验证
        //    如果验证通过，会触发 submit 事件
        //    如果验证失败，不会触发 submit
        mobile: [
          { required: true, message: '手机号码不能为空' },
          {
            pattern:
              /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
            message: '请输入正确手机号码'
          }
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          {
            pattern: /^\d{6}$/,
            message: '请输入正确的验证码'
          }
        ]
      },
      isCountDown: false
    }
  },
  methods: {
    async onSubmit() {
      // 1获取表单数据
      const user = this.user
      // 利用vant实现加载功能效果
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true,
        // loadingType: 'spinner',
        duration: 0 // 这句语句的意思是让它的duration为0，即一直转圈，直到请求结束
      })

      // 3提交表单请求登录,直接将请求接口封装为一个模块进行调用
      // 利用trycatch用于捕获异常
      try {
        const {
          data: { data }
        } = await login({ mobile: user.mobile, code: user.code })
        // 此处的toast之所以能够显示，是因为在vue中toast只能有一个，每出现新一个toast都会把之前的toast给覆盖掉
        this.$toast.success('登陆成功')
        // 通过vuex将返回来的token存至state中的user对象中
        // 当登陆成功后让页面跳转回原来的页面,但并不严谨
        this.$router.back()
        this.$store.commit('setUser', data)
      } catch (error) {
        if (error.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('未知错误，请稍后再试')
        }
      }

      // 4根据请求响应结果处理后续操作
    },
    async sendSMS() {
      // 1 点击获取验证码按钮进行仅电话号验证
      //   可以通过ref获取表单实例，然后调用validate方法针对某一个表单元素进行正则验证
      //   且获取的结果是一个promise对象，可以使用async来进行异步操作
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (error) {
        return console.log('验证失败')
      }
      // 2 验证通过显示倒计时如果执行到这一步说明return没有执行
      this.isCountDown = true
      // 3 发送请求给后端接口请求验证码,同样封装一个请求模块
      try {
        await sendMSG(this.user.mobile)
        this.$toast('发送成功')
      } catch (error) {
        // 发送失败时也同时关闭倒计时
        this.isCountDown = false
        if (error.response.status === 429) {
          this.$toast('操作过于频繁，请稍后再试')
        } else {
          this.$toast('发送失败请稍后再试')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .lyjc {
    font-size: 37px;
  }
  .sendMSG {
    background-color: rgb(238, 238, 238);
    color: rgb(134, 134, 134);
    // width: 152px;
    height: 46px;
    line-height: 46px;
    font-size: 22px;
  }
  .loginButton {
    padding: 53px 33px;
    .loginButton-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
