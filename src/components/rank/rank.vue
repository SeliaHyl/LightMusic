<template>
  <div class="rank" ref="rank">
    <scroll class="toplist-wrapper" :data="topList" ref="list">
      <div class="top-list" v-show="topList&&topList.length">
        <div class="list-detail" v-for="list in topList" @click="selectItem(list)">
          <div class="image">
            <img v-lazy="list.imgUrl" />
          </div>
          <div class="songs">
            <p
              class="text"
              v-for="(item,index) in list.topThree"
            >{{index+1}}. {{item.name}} - {{item.ar[0].name}}</p>
          </div>
        </div>
      </div>
      <div class="loading-data" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import axios from 'axios'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { mapMutations } from 'vuex'
import { listMixin } from 'common/js/mixin'

export default {
  mixins: [listMixin],
  data() {
    return {
      topList: []
    }
  },
  created() {
    this.getTopListData()
  },
  methods: {
    getTopListData() {
      let arr = [0, 1, 2, 3, 4, 23, 28, 31]
      arr.forEach((idx) => {
        this._getTopList(idx).then(playlist => {
          let { id, name, coverImgUrl, tracks } = playlist
          const topThree = tracks.slice(0, 3)
          const halfTracks = tracks.slice(0, 50)
          this.topList.push({ id: id, name: name, imgUrl: coverImgUrl, topThree: topThree, tracks: halfTracks })
        })
      })
    },
    //获取榜单数据,idx区别不同榜单
    async _getTopList(idx) {
      const res = await this.$Http.TopList({
        idx: idx
      })
      return Promise.resolve(res.playlist)
    },
    selectItem(list) {
      this.$router.push(`/rank/${list.id}`)
      this.setTopList(list)
    },
    ...mapMutations({
      setTopList: 'SET_TOPLIST'
    }),
    handleList(playlist) {
      const bottom = playlist.length > 0 ? '50px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.list.refresh()
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.rank
  position fixed
  top 88px
  left 0
  bottom 0
  right 0
  width 100%
  background-color $color-theme
  .toplist-wrapper
    height 100%
    overflow hidden
    .top-list
      width 94%
      margin 0 auto
      overflow hidden
      .list-detail
        display flex
        align-items center
        width 100%
        height 100px
        padding 5px
        .image
          width 100px
          height 100px
          flex 0 0 100px
          img
            height 100%
            width 100%
            border-radius 5px
        .songs
          display flex
          flex-direction column
          justify-content center
          flex 1
          padding 0 10px
          overflow hidden
          .text
            no-wrap()
            line-height 28px
            font-size $font-size-medium
            color $color-word
    .loading-data
      loading-data()
</style>