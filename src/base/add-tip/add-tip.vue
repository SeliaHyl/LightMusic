<template>
  <transition name="tip">
    <div class="add-tip" v-show="showFlag">
      <span class="text">歌曲已添加到播放列表</span>
    </div>
  </transition>
</template>
<script>
export default {
  data() {
    return {
      showFlag: false
    }
  },
  methods: {
    show() {
      this.showFlag = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.hide()
      }, 1500)
    },
    hide() {
      this.showFlag = false
    }
  },
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable'
.add-tip
  position fixed
  bottom 12%
  left 0
  width 100%
  z-index 300
  text-align center
  .text
    background-color $color-light-background
    padding 10px 15px
    font-size $font-size-small
    color $color-word
    border-radius 15px
  &.tip-enter-active,.tip-leave-active
    transition all 0.1s
  &.tip-enter, .tip-leave-to
    transform translate3d(0, 100%, 0)
</style>