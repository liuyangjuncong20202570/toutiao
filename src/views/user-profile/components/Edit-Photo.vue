<template>
  <div class="edit-photo">
    <img class="image" :src="img" alt="" ref="image" />
    <van-nav-bar
      class="toolbar"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    ></van-nav-bar>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { changeUserphoto } from '@/api/user-profile.js'
export default {
  data() {
    return {
      img: window.URL.createObjectURL(this.filesrc),
      cropper: null // 存放裁切对象
    }
  },
  name: 'EditPhoto',
  props: {
    filesrc: {
      type: File,
      required: true
    }
  },
  methods: {
    // 这个函数实质上是在封装cropper，因为这个插件不支持promise也就是无法进行异步操作async、await所以我们可以给他封装一个promise对象
    // 在promise的回调函数中return出来他的实例blob，最后在const一个file用来接收return出来的blob实例，并将该实例传给formdata，这个实例实际上
    // 就是裁切框通过裁切原图片获取的图片实例
    getCroppedCanvas() {
      return new Promise((resolve) => {
        this.cropper.getCroppedCanvas().toBlob((blob) => {
          resolve(blob)
        })
      })
    },
    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true
      })
      try {
        const file = await this.getCroppedCanvas()
        const fd = new FormData()
        fd.append('photo', file)
        await changeUserphoto(fd)
        this.$emit('close')
        this.$emit('update-photo', window.URL.createObjectURL(file))
        this.$toast.success('保存成功')
      } catch (error) {
        this.$toast.fail('保存失败')
      }
    }
  },
  mounted() {
    const image = this.$refs.image
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move', // 拖动模式为移动
      aspectRatio: 1, // 裁切框比例
      // autoCropArea: 1, 裁切框大小，为1则覆盖整个图片
      cropBoxMovable: false, // 裁切框是否可移动
      cropBoxResizable: false, // 裁切框是否可以放大缩小
      background: false, // 裁切框背景颜色
      movable: true // 裁切框是否可以移动
    })
  }
}
</script>

<style lang="less" scoped>
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
}
.image {
  /* Ensure the size of the image fit the container perfectly */
  display: block;
  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>
