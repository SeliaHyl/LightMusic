<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
  props: {
    probeType: {
      type: Number,
      default: 1 // proType=1 非实时派发scroll事件
    },
    click: {
      type: Boolean,
      default: true // 允许click事件
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      if (this.listenScroll) {
        let me = this
        this.scroll.on('scroll', pos => {
          me.$emit('scroll', pos)
        })
      }
    },
    // 禁用better-scroll
    disable() {
      this.scroll && this.scroll.disable()
    },
    // 默认开启scroll
    enable() {
      this.scroll && this.scroll.enable()
    },
    // 重新计算better-scroll，当DOM结构发生变化时调用确保滚动正常
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    // 滚动到指定的位置
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    // 滚动到指定的目标元素
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  // 监听data变化
  watch: {
    data() {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus"></style>