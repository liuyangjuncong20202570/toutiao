<template>
  <!-- 具体首页的文章效果以及解构在这个页面上进行展示 -->
  <!-- load事件:
+ List初始化后会触发一次load事件，用于加载第一屏的数据。＋如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List会继续触发1oad
事件，直到内容铺满屏幕或数据全部加载完成。
 -->
  <div class="artical-list" ref="articalList">
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      :success-text="refreshText"
      :success-duration="1500"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- .sync是用于同步子组件数据 -->
        <ArticalItem
          :artical="item"
          v-for="(item, index) in list"
          :key="index"
          :title="item.title"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
        ></ArticalItem>
        <!-- <van-cell
          v-for="(item, index) in list"
          :key="index"
          :title="item.title"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import ArticalItem from '@/components/artical-item/index.vue'
import { getArticals } from '@/api/artical.js'
export default {
  components: {
    ArticalItem
  },
  data() {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中loading状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求加载下一页的时间戳
      error: false, // 控制请求失败后的逻辑处理
      isLoading: false, // 控制下拉后loading状态
      refreshText: '刷新成功',
      scrollTop: 0 // 初始文章列表距离顶端的距离
    }
  },
  mounted() {
    const articalList = this.$refs.articalList
    articalList.addEventListener(
      'scroll',
      debounce(() => {
        this.scrollTop = articalList.scrollTop
      }, 50)
    )
  },
  // 此生命周期函数与deactivated一样，都是和keep-alive配合使用，只有当组件被缓存或取消缓存时才会触发
  activated() {
    // 在mounted生命周期函数中获取的scrollTOp重新赋值给DOM的scrollTop做到记录滑动位置的效果
    this.$refs.articalList.scrollTop = this.scrollTop
  },
  name: 'articalList',
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  methods: {
    async onLoad() {
      // 异步更新数据
      // 1、通过axios/ajax发送请求获取数据
      try {
        const {
          data: { data }
        } = await getArticals({
          id: this.channel.id,
          // 时间戳简单理解就是第一页的页码，要获取最新数据，就需要最新的当前时间
          time: this.timestamp || Date.now()
        })
        // 2、将获取的数据添加至list数组中
        // this.list = result不能直接使用该方法，将result直接插入list数组中，因为我们的项目使滚动式的，应该让获取的数据一项一项的插入list数组中
        // 所以我们可以用数组的展开运算符，将results中的数据一项一项的插入到list数组中
        const results = data.results
        this.list.push(...results)
        // 3、本次数据加载结束之后要把加载状态设置为结束
        // loading关闭以后才能触发下一次的加载更多
        this.loading = false

        // 4、判断数据是否全部加载完成
        if (results.length) {
          // 如果还未更新完成，则将本次请求的时间戳更换为获取的数据中的pre_timestamp，用于获取下一页数据
          this.timestamp = data.pre_timestamp
        } else {
          // 5、如果没有数据了，把finished设置为true，之后不再触发加载更多
          this.finished = true
        }
      } catch (err) {
        // 展示错误提示状态
        this.error = true
        // 请求失败了，loading也需要关闭
        this.isLoading = false
        this.finished = true
        // console.log('失败')
      }
    },
    async onRefresh() {
      try {
        // 获取数据
        const {
          data: { data }
        } = await getArticals({
          id: this.channel.id,
          // 时间戳简单理解就是第一页的页码，要获取最新数据，就需要最新的当前时间
          time: Date.now() // 下拉刷新每次获取最新数据，所以直接传递最新时间戳即可
        })
        // 将获取的数据追加到页面的顶部
        const results = data.results
        this.list.unshift(...results)
        // 最后将下拉状态的loading设置为false
        this.isLoading = false
        // 更新成功后显示更新成功文本
        this.refreshText = `刷新成功，更新${results.length}条数据`
      } catch (error) {
        this.error = true
        this.isLoading = false
        this.refreshText = '刷新失败'
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.artical-list {
  // 此处样式的含义是：之前页面滚动的滚动条是页面整个body的，当加上overflow：auto时，整个div就有了自己的滚顶条
  // 且只有当盒子内容大于盒子本身高度时才会显示该滚动条，所以每个频道的滚动条不会互相影响，也就能记住每个页面滚动的位置了
  // vh、vw是CSS新添的两个高宽视口单位，是以浏览器窗口大小为参考的单位，移动端是以布局视口为标准
  // 1vh=可视区域高度的百分之一
  // 1vw=可视区域宽度的百分之一
  height: 79vh;
  overflow: auto;
}
</style>
