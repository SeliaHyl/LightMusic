<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-wrapper" :data="playLists" ref="list">
      <div class="recommend-wrapper-content">
        <slider class="slider-wrapper" :banners="banners"></slider>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <div class="list-container">
            <div
              class="list-content"
              v-for="(item,index) in playLists"
              :key="index"
              @click="selectItem(item)"
            >
              <img class="list-img" v-lazy="item.coverImgUrl" />
              <p class="list-text" v-html="item.name"></p>
            </div>
          </div>
        </div>
      </div>
      <div class="loading-data" v-show="!playLists.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import axios from 'axios'
import { mapMutations } from 'vuex'
import { listMixin } from 'common/js/mixin'

export default {
  mixins: [listMixin],
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
      }
    },
    // 获取热门歌单数据
    async _getPlayList() {
      let res = await this.$Http.HotPlayList({
        order: 'hot',
        limit: 30
      })
      if (res.code === 200) {
        this.playLists = res.playlists
      }
    },
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.id}`
      })
      this.setRecomlist(item)
    },
    ...mapMutations({
      setRecomlist: 'SET_RECOMLIST'
    }),
    handleList(playList) {
      const bottom = playList.length > 0 ? '50px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.list.refresh()
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.recommend
  position fixed
  top 88px
  bottom 0
  left 0
  right 0
  width 100%
  .recommend-wrapper
    height 100%
    overflow hidden
    .recommend-wrapper-content
      .slider-wrapper
        width 94%
        margin 0 auto
      .recommend-list
        background-color $color-theme
        .list-title
          height 40px
          line-height 40px
          padding-left 10px
          font-size $font-size-medium
          color $color-theme
          background-color $color-background
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
              color $color-word
              font-size $font-size-medium
              width 100%
              line-height 20px
              line-wrap()
              overflow hidden
    .loading-data
      loading-data()
</style>