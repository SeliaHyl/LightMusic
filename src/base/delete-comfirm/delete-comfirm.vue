<template>
  <div class="delete-comfirm" v-show="showFlag" @click.stop>
    <div class="content">
      <p class="text">{{text}}</p>
      <div class="buttom">
        <div class="cancel" @click="cancel">取消</div>
        <div class="comfirm" @click="comfirm">确定</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showFlag: false
    }
  },
  methods: {
    show() {
      this.showFlag = true
    },
    hide() {
      this.showFlag = false
    },
    cancel() {
      this.hide()
    },
    comfirm() {
      this.$emit('comfirm')
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable'
.delete-comfirm
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  z-index 500
  background-color rgba(7, 17, 27, 0.2)
  .content
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    z-index 501
    width 270px
    padding 20px
    border-radius 10px
    background-color $color-theme
    .text
      width 100%
      margin-bottom 15px
      height 30px
      line-height 30px
      font-size $font-size-medium
      color $color-word-l
    .buttom
      display flex
      justify-content flex-end
      align-items center
      text-align center
      height 30px
      font-size $font-size-medium
      color red
      .cancel, .comfirm
        padding 5px 10px
</style>