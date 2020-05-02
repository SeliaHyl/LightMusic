<template>
  <div class="recommend">
    <scroll class="recommend-wrapper" :data="playLists">
      <div class="recommend-wrapper-content">
        <slider class="slider-wrapper" :banners="banners"></slider>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <div class="list-container">
            <div class="list-content" v-for="(item,index) in playLists" :key="index">
              <img class="list-img" v-lazy="item.coverImgUrl" />
              <p class="list-text" v-html="item.name"></p>
            </div>
          </div>
        </div>
        <div class="loading-data" v-show="!playLists.length">
          <loading></loading>
        </div>
      </div>
    </scroll>
  </div>
</template>
<script>
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import axios from 'axios'
export default {
  name: 'Recommend',
  data() {
    return {
      banners: [],
      playLists: []
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  created() {
    this._getBanner()
    this._getPlayList()
  },
  methods: {
    // 获取轮播图数据
    async _getBanner() {
      let res = await this.$Http.Banner({
        type: 2
      })
      if (res.code === 200) {
        this.banners = res.banners
        console.log(this.banners)
      }
    },
    // 获取热门歌单数据
    async _getPlayList() {
      let res = await this.$Http.HotPlayList({
        order: 'undefined',
        limit: 30
      })
      if (res.code === 200) {
        this.playLists = res.playlists
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.recommend
  position fixed
  width 100%
  top 88px
  bottom 0
  .recommend-wrapper
    height 100%
    overflow hidden
    .recommend-wrapper-content
      .slider-wrapper
        width 96%
        margin 0 auto
      .recommend-list
        .list-title
          height 40px
          line-height 40px
          margin-left 10px
          font-size $font-size-medium
          color $color-theme
        .list-container
          width 100%
          display flex
          flex-wrap wrap
          justify-content center
          .list-content
            width 110px
            height 160px
            margin 5px
            .list-img
              width 100%
              height 110px
              border-radius 10px
            .list-text
              font-size $font-size-medium
              width 100%
              line-height 20px
              line-wrap()
              overflow hidden
      .loading-data
        loading-data()
</style>