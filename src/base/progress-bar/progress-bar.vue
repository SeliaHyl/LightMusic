<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend.prevent="progressTouchEnd"
      >
        <div class="btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {}
    this.touch.init = false
  },
  methods: {
    progressTouchStart(e) {
      this.touch.init = true
      this.touch.startX = e.touches[0].pageX
      this.touch.progWidth = this.$refs.progress.clientWidth
    },
    progressTouchMove(e) {
      if (!this.touch.init) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(Math.max(0, this.touch.progWidth + deltaX), this.$refs.progressBar.clientWidth)
      this._offsetWidth(offsetWidth)
    },
    progressTouchEnd(e) {
      this.touch.init = false
      this._touchEnd()
    },
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this._offsetWidth(offsetWidth)
      this._touchEnd()
    },
    _touchEnd() {
      const barWidth = this.$refs.progressBar.clientWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('progressChange', percent)
    },
    _offsetWidth(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style.transfrom = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.progressBtn.style.webkitTransform = `translate3d(${offsetWidth}px, 0, 0)`
    }
  },
  watch: {
    percent(newPercent) {
      //当touch事件结束后才监视percent改变progress-width
      if (newPercent > 0 && this.touch.init === false) {
        const barWidth = this.$refs.progressBar.clientWidth
        const offsetWidth = newPercent * barWidth
        this._offsetWidth(offsetWidth)
      }
    }
  }
}
</script>
<style scoped lang="stylus">
@import '~common/stylus/variable'
.progress-bar
  height 20px
  .bar-inner
    position relative
    top 8px
    height 4px
    background rgba(0, 0, 0, 0.3)
    .progress
      position absolute
      height 100%
      background $color-theme
    .progress-btn
      position absolute
      left -10px
      top -8px
      width 20px
      height 20px
      .btn
        position relative
        top 4px
        left 4px
        box-sizing border-box
        width 12px
        height 12px
        border 2px solid $color-theme
        border-radius 50%
        background $color-progress
</style>