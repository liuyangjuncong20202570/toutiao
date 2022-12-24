<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit"
        slot="right-icon"
        plain
        size="mini"
        round
        type="danger"
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(value, index) in channels"
        :key="value.id"
        @click="desideMyoperation(value, index)"
      >
        <!-- 注意当使用插槽插入图片时，插件会自动增加一个父节点且为相对定位，所以此时图片的样式的定位会根据这个父节点来的 -->
        <!-- 对于图标的显示隐藏不仅要点击按钮还要判断该频道是否是固定频道是则可以删不是则不删 -->
        <van-icon
          v-show="isEdit && !fixChannels.includes(value.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <span class="text" :class="{ active: index === active }" slot="text">{{
          value.name
        }}</span>
      </van-grid-item>
    </van-grid>
    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recomand-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="value in recommandChannels"
        icon="plus"
        :key="value.id"
        :text="value.name"
        @click="addChannel(value)"
      />
    </van-grid>
    <!-- /频道推荐 -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage.js'
import {
  getAllchannels,
  Onlinechannels,
  deleteOnlinechannels
} from '@/api/channel.js'
export default {
  data() {
    return {
      fixChannels: [0], // 固定频道不允许删除
      allChannels: [],
      isEdit: false // 控制编辑按钮图标的显示
    }
  },
  name: 'Channeledit',
  props: {
    active: {
      type: Number
      // required: true
    }
  },
  methods: {
    async getChannels() {
      try {
        const {
          data: {
            data: { channels }
          }
        } = await getAllchannels()
        this.allChannels = channels
      } catch (error) {
        this.$toast('获取数据失败,请稍后再试')
      }
    },
    async addChannel(val) {
      this.$store.commit('updateChannels', val)
      // 添加频道时执行的数据持久化处理
      if (this.user) {
        // 已登录，把数据请求接口放到线上
        // 关于数据持久化我的思路是：当前端向后端传递数据时，如果没有token值时
        // 返回的频道数组是一个固定数组，当前端向后端提交数据中有token时，后端会从数据库中
        // 获取该token对应的数组返给前端频道数组
        try {
          await Onlinechannels({ id: val.id, seq: this.channels.length })
        } catch (error) {
          this.$toast('保存失败，请稍后再试')
        }
      } else {
        // 未登录，把数据存储在本地
        setItem('localChanels', this.channels)
      }
    },
    async desideMyoperation(value, index) {
      if (this.isEdit) {
        // 激活状态为删除频道
        // 做一个判断，当删除的标签在选定值前面的时候需要进行active减一操作
        // 如果索引中含有固定频道的索引则不删除，直接return
        if (this.fixChannels.includes(value.id)) {
          return
        }
        if (index <= this.active) {
          this.$emit('updateActive', this.active - 1, true)
        }
        this.$store.commit('removeChannels', index)
        this.deleteChannels(value, index)
      } else {
        // 判断编辑按钮在未激活状态为跳转频道
        // 利用自定义事件向父组件传值达到跳转的效果
        this.$emit('updateActive', index, false)
      }
    },
    async deleteChannels(val) {
      // 删除频道数据时执行数据持久化
      try {
        if (this.user) {
          // 已登录，把数据请求接口放到线上
          // 关于数据持久化我的思路是：当前端向后端传递数据时，如果没有token值时
          // 返回的频道数组是一个固定数组，当前端向后端提交数据中有token时，后端会从数据库中
          // 获取该token对应的数组返给前端频道数组
          await deleteOnlinechannels(val.id)
        } else {
          // 未登录，把数据存储在本地
          setItem('localChanels', this.channels)
        }
      } catch (error) {
        this.$toast('移除失败，请稍后再试')
      }
    }
  },
  computed: {
    ...mapState(['channels', 'user']),
    // 此处计算属性可以帮助我们动态感知频道数组的变化，当channels发生变化时，推荐频道也会动态的发生变化
    recommandChannels() {
      return this.allChannels.filter((Rchannels) => {
        return !this.channels.find((item) => {
          return item.id === Rchannels.id
        })
      })

      // const channels = []
      // this.allChannels.forEach((channel) => {
      //   const ret = this.channels.find((mychannel) => {
      //     return mychannel.id === channel.id
      //   })
      //   if (!ret) {
      //     channels.push(channel)
      //   }
      // })
      // return channels
    }
  },
  created() {
    this.getChannels()
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;
  /deep/ .van-grid-item__icon-wrapper {
    // 给新增的父节点的样式的定位设置为空
    position: unset;
  }
  .title-text {
    font-size: 32px;
    color: #333333;
  }

  .edit {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;

    .van-grid-item__text,
    .text {
      margin-top: unset;
      font-size: 28px;
      color: #222;
    }

    .van-grid-item__content {
      background-color: #f4f5f6;
      white-space: nowrap;
    }
  }

  /deep/ .recomand-grid {
    .van-grid-item__content {
      flex-direction: row;
    }
    .van-icon-plus {
      font-size: 28px;
      margin-right: 6px;
    }
    .van-grid-item__text {
      margin-top: unset;
    }
  }

  /deep/ .my-grid {
    .van-icon-clear {
      position: absolute;
      right: -10px;
      top: -10px;
      font-size: 30px;
      color: #cacaca;
      z-index: 2;
    }

    .active {
      color: #f85959;
    }
  }
}
</style>
