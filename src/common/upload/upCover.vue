<template>
  <div
    class="cover-upload-wrap"
    ref=coverOutWrap
    :style="{
      width: width ? (width + 'px') : '100%',
      height: calcHeight + 'px',
      maxWidth: maxWidth ? (maxWidth + 'px') : '100px',
      maxHeight: maxHeight ? (maxHeight + 'px') : '100px'
    }">
    <el-upload
      ref="upload"
      class="cover-uploader"
      action="https://pig-blog.oss-cn-guangzhou.aliyuncs.com/"
      :data="multipartParams"
      :show-file-list="false"
      :auto-upload="false"
      :before-upload="beforeAvatarUpload"
      :on-success="handleAvatarSuccess"
      :on-change="onFileChange"
      :on-progress="onUploadProgress">
      <div class="img-wrap">
        <img :src="imageUrl" class="cover" v-if="imageUrl">
        <div class="img-mask-default" :class="{'img-mask': imageUrl}">
          <i class="el-icon-upload"></i>
          <div>{{ tip }}</div>
        </div>
      </div>
    </el-upload>
    <cropperBox
      ref="cropperBox"
      :options="options"
      :uploadProgress="uploadProgress"
      @finishCropImage="finishCropImage">
    </cropperBox>
  </div>
</template>
<script>
import {
  mapActions
} from 'vuex'

import cropperBox from './cropperBox'

export default {
  name: 'up-cover',
  components: {
    cropperBox
  },
  props: {
    defaultImg: String,
    ratio: { // 裁剪结果宽高比
      default: 1
    },
    width: Number,
    height: Number,
    WHRatio: { // 组件宽高比
      default: 1
    },
    maxWidth: String,
    maxHeight: String,
    tip: {
      default: '上传图片'
    },
    maxSize: { // 最大选择图片的大小，单位M
      default: 3
    }
  },
  data () {
    return {
      cropper: null,
      newFile: null,
      options: {
        aspectRatio: 1,
        preview: '#cropperRes',
        zoomOnWheel: false,
        minCropBoxWidth: 50
      },
      token: {},
      uploadProgress: 0,
      calcHeight: 0,
      multipartParams : {
        key : '',
        policy: '',
        OSSAccessKeyId: '',
        success_action_status : 200, //让服务端返回200,不然，默认会返回204
        signature: '',
      },
      host : ''
    }
  },
  created() {
    this.options.aspectRatio = this.ratio
    if (this.height) {
      this.calcHeight = this.heights
    }
  },
  computed: {
    imageUrl () {
      return this.defaultImg
    }
  },
  mounted() {
    if (!this.calcHeight) {
      if (this.width) {
        this.calcHeight = this.width / this.WHRatio
      } else {
        this.calcHeight = this.$refs.coverOutWrap.offsetWidth / this.WHRatio
      }
    }
  },
  methods: {
    ...mapActions([
      'getQiniuToken',
      'getAliCloudToken'
    ]),
    onFileChange (file, fileList) {
      if (file.status === 'ready') {
        const fileType = [
          'image/jpeg',
          'image/png',
          'image/webp'
        ]
        const type = fileType.indexOf(file.raw.type)
        const size = file.raw.size / 1024 / 1024 <= this.maxSize
        if (type === -1) {
          this.$toast('只限jpg、png、webp格式', 'error')
          return false
        }
        if (!size) {
          this.$toast(`图片太大了~最多支持${this.maxSize}MB`, 'error')
          return false
        }
        this.$refs.cropperBox.show()
        this.$refs.cropperBox.loadCropper(file.raw)
      }
    },
    finishCropImage (newFile) {
      this.newFile = newFile
      // this.getQiniuToken(true)
      //   .then((data) => {
      //     this.token = data
      //     this.$refs.upload.submit()
      //   })
      this.getAliCloudToken()
      .then((data) => {
        this.multipartParams.key = data.dir + this.newFile.uid + '.jpg'
        this.multipartParams.OSSAccessKeyId = data.accessId
        this.multipartParams.policy = data.policy
        this.multipartParams.signature = data.signature
        this.host = data.host
        this.$refs.upload.submit()
      })
    },
    handleAvatarSuccess (response, file) {
      this.$emit('uploadSuccess', 'https://pig-blog.oss-cn-guangzhou.aliyuncs.com/'+this.multipartParams.key)
      this.$refs.cropperBox.close()
    },
    beforeAvatarUpload (file) {
      // let uploadFile = new window.File([this.newFile], file.name, { type: this.newFile.type })
      // uploadFile.uid = this.newFile.uid
      // return Promise.resolve(uploadFile)
    },
    onUploadProgress (event, file, fileList) {
      this.uploadProgress = parseInt(event.percent) - 1
    }
  }
}
</script>
<style lang="stylus">
@import '~STYLUS/color.styl'
.cover-upload-wrap
  position: relative
  width: 100%
  max-width: 300px
  height: 150px
  border-radius: 5px
  .cover-uploader
    width: 100%
    height: 100%
    .el-upload
      width: 100%
      height: 100%
      overflow: hidden
      border-radius: 5px
      cursor: pointer
      border: 1px solid #dddddd
      .img-wrap
        position: relative
        width: 100%
        height: 100%
        &:hover
          .img-mask-default
            opacity: 1
            background-color: rgba(0, 0, 0, 0.5)
            color: $color-white
        .cover
          position: relative
          width: 100%
          height: 100%
          border-radius: 5px
        .img-mask-default
          position: absolute
          left: 0
          top: 0
          width: 100%
          height: 100%
          padding-left: 10px
          padding-right: 10px
          background-color: $color-white
          color: #555555
          display: flex
          flex-direction: column
          justify-content: center
          font-size: 12px
          transition: all .2s linear
          .el-icon-upload
            font-size: 18px
        .img-mask
          opacity: 0

</style>
