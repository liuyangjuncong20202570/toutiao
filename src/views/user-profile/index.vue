<template>
  <div class="user-profie">
    <van-nav-bar
      class="page-nav-bar"
      title="个人资料"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
    />
    <input
      type="file"
      accept="image/*"
      hidden
      ref="file"
      @change="onFilechange"
    />
    <van-cell title="头像" is-link center @click="$refs.file.click()">
      <van-image
        slot="default"
        width="30"
        height="30"
        round
        fit="cover"
        :src="userProfile.photo"
      />
    </van-cell>
    <van-cell
      title="昵称"
      is-link
      :value="userProfile.name"
      @click="isnickNameshow = true"
    >
    </van-cell>
    <van-cell
      title="性别"
      is-link
      :value="userProfile.gender === 0 ? '男' : '女'"
      @click="isgendershow = true"
    ></van-cell>
    <van-cell
      @click="isbirthdayshow = true"
      title="生日"
      is-link
      :value="userProfile.birthday"
    ></van-cell>
    <!-- 昵称修改弹出层 -->
    <van-popup
      v-if="isnickNameshow"
      v-model="isnickNameshow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <EditName
        v-model="userProfile.name"
        @close="isnickNameshow = false"
      ></EditName>
    </van-popup>
    <!-- /昵称修改弹出层 -->

    <!-- 修改性别 -->
    <van-popup v-if="isgendershow" v-model="isgendershow" position="bottom">
      <EditGender
        :gender.sync="userProfile.gender"
        @close="isgendershow = false"
      ></EditGender>
    </van-popup>
    <!-- /修改性别 -->

    <!-- 修改生日 -->
    <van-popup v-if="isbirthdayshow" v-model="isbirthdayshow" position="bottom">
      <EditBirthday
        v-model="userProfile.birthday"
        @close="isbirthdayshow = false"
      ></EditBirthday>
    </van-popup>
    <!-- /修改生日 -->

    <!-- 修改用户头像 -->
    <van-popup
      class="editphoto"
      v-if="isphotoshow"
      v-model="isphotoshow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <EditPhoto
        :filesrc="blob"
        @close="isphotoshow = false"
        @update-photo="userProfile.photo = $event"
      ></EditPhoto>
    </van-popup>
    <!-- /修改用户头像 -->
  </div>
</template>

<script>
import EditPhoto from '@/views/user-profile/components/Edit-Photo.vue'
import EditBirthday from '@/views/user-profile/components/Edit-Birthday.vue'
import EditGender from '@/views/user-profile/components/Edit-Gender.vue'
import EditName from '@/views/user-profile/components/Edit-Name.vue'
import { getUserprofile } from '@/api/user-profile.js'
export default {
  components: {
    EditName,
    EditGender,
    EditBirthday,
    EditPhoto
  },
  data() {
    return {
      userProfile: {},
      isnickNameshow: false,
      isgendershow: false,
      isbirthdayshow: false,
      isphotoshow: false,
      blob: null // 用于存储获取的file地址
    }
  },
  name: 'userProfile',
  created() {
    this.loadUserprofile()
  },
  methods: {
    async loadUserprofile() {
      const {
        data: { data }
      } = await getUserprofile()
      this.userProfile = data
    },
    onFilechange() {
      // 为了防止由于点击同一张图片导致不触发change事件所以在这里手动清空value值
      this.isphotoshow = true
      // 以下语句可以通过浏览器内置的bom将获取的类型file打开的文件转换为一个src地址，这个src地址可以用于访问，也即是将获取的文件转换为blob数据类型
      // blob数据类型是一种二进制数据类型
      // 疑惑：为什么不直接使用formdata上传到接口呢？根据接口文档，此处文档要求的文件类型是URL地址，所以也就是我们需要获取到file文件类型后还得
      // 转换成src地址才能上传到接口上，所以这里不能使用原生的formdata格式上传至接口
      this.blob = this.$refs.file.files[0]
      this.$refs.file.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
.van-popup {
  background-color: #f5f7f9;
}
.editphoto {
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
