<template>
  <div class="user-chat">
    <!-- 登录导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="小智同学"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 消息列表 -->
    <van-cell-group class="newsList" ref="newsList">
      <van-cell
        v-for="(item, index) in messages"
        :key="index"
        :title="item.msg"
      />
    </van-cell-group>
    <!-- /消息列表 -->

    <!-- 输入框 -->
    <van-cell-group class="inputText">
      <van-field
        v-model="textvalue"
        placeholder="请输入聊天文本"
        :border="false"
      />
      <van-button type="primary" size="small" @click="onSend">发表</van-button>
    </van-cell-group>
    <!-- /输入框 -->
  </div>
</template>

<script>
import { io } from 'socket.io-client'
import { setItem, getItem } from '@/utils/storage.js'
export default {
  watch: {
    messages() {
      setItem('chat-messages', this.messages)
      // 由于数据更新导致视图的变化不是立即的，所以我们需要将dom操作放到nextTick中，保证获取的DOM是最新的
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    }
  },
  name: 'userChat',
  data() {
    return {
      textvalue: '',
      socket: null, // 用于存放socket对象
      messages: getItem('chat-messages') || [] // 存放消息列表
    }
  },
  created() {
    // 当引入io对象后，可以通过io传递即时通信的接口地址
    const socket = io('http://toutiao.itheima.net', {
      transports: ['websocket']
    })
    this.socket = socket
    // 建立链接时会触发connect事件
    socket.on('connect', () => {
      console.log('连接成功')
    })
    // 当断开连接时会触发disconnect事件
    socket.on('disconnect', () => {
      console.log('连接失败')
    })

    // 发送消息
    // socket.emit('消息类型','消息内容')
    // 接收消息
    // socket.on('消息类型',function(data){data为获取的数据})
    // 获取服务器发来的消息
    // 监听message事件，获取client中的数据
    socket.on('message', (data) => {
      console.log(data)
      this.messages.push(data)
    })
  },
  methods: {
    onSend() {
      const data = {
        msg: this.textvalue,
        timestamp: Date.now()
      }
      this.socket.emit('message', data)
      this.messages.push(data)
      // 清空输入框
      this.textvalue = ''
    },
    scrollToBottom() {
      const list = this.$refs.newsList
      list.scrollTop = list.scrollHeight
    }
  },
  mounted() {
    this.scrollToBottom()
  }
}
</script>

<style lang="less" scoped>
.newsList {
  position: fixed;
  left: 0;
  right: 0;
  top: 92px;
  bottom: 88px;
  overflow: auto;
}
.inputText {
  padding: 0 14px;
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
