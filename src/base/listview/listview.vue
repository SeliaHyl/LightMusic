<template>
  <scroll class="listview"
          :data="data"
          ref="listview"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="scroll">
    <ul>
      <li class="list-group"
          v-for="group in data"
          ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item"
              v-for="item in group.items"
              :key="item.id"
              @click="selectItem(item)">
            <img class="head-img"
                 v-lazy="item.imgUrl" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-fastcut" @touchstart.prevent="onFastcutTouchStart" @touchmove.prevent="onFastcutTouchMove">
      <ul>
        <li class="item"
            v-for="(item, index) in fastcutlist"
            :data-index="index"
            :class="{'current':currentIndex===index}"
        >{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div class="loading-data" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getData } from 'common/js/dom'

const ANCHOR_HEIGHT = 18
export default {
  created () {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0
    }
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  components: {
    Scroll,
    Loading
  },
  computed: {
    fastcutlist () {
      return this.data.map(group => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : ''
    }
  },
  methods: {
    onFastcutTouchStart (e) {
      // 拿到锚点的index
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onFastcutTouchMove (e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    scroll (pos) {
      // 拿到监控scroll的y值
      this.scrollY = pos.y
    },
    _scrollTo (index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    selectItem (item) {
      this.$emit('select', item)
    },
    refresh() {
      this.$refs.listview.refresh()
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (!height2 || (-newY >= height1 && -newY < height2)) {
          this.currentIndex = i
          return
        }
      }
      // 当滚动到底部，且-newY > 最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    }
  }
}
</script>
<style scoped lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.listview
  position fixed
  top 88px
  left 0
  right 0
  bottom 0
  width 100%
  overflow hidden
  background-color $color-background
  .list-group
    background-color $color-list-background
    padding-bottom 20px
    .list-group-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size $font-size-medium
      color $color-theme
      background-color $color-background-ll
    .list-group-item
      display flex
      align-items center
      width 100%
      box-sizing border-box
      padding 20px 0 0 20px
      .head-img
        width 50px
        height 50px
        border-radius 10px
      .name
        margin-left 20px
        color $color-word
        font-size $font-size-medium
  .list-fastcut
    position absolute
    z-index 30
    right 6px
    top 50%
    transform translateY(-50%)
    width 20px
    text-align center
    padding 20px 0
    border-radius 10px
    .item
      padding 2px
      line-height 1
      color $color-word-d
      font-size $font-size-small
      &.current
        color $color-word
  .list-fixed
    position absolute
    top 0
    left 0
    width 100%
    .fixed-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size $font-size-small
      color $color-theme
      background-color $color-background
  .loading-data
    loading-data()
</style>