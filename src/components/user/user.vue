<template>
  <div class="user-center">
    <div class="header">
      <i class="icon-back" @click="back"></i>
      <h1 class="title">最近播放</h1>
    </div>
    <div class="sub-head">
      <div class="play-btn" ref="playBtn" @click="playAll">
        <i class="icon-play"></i>
        <span class="text">播放全部</span>
      </div>
      <div class="delete-btn" @click="deleteHistory">
        <i class="icon-clear"></i>
      </div>
    </div>
    <div class="list-wrapper" ref="listWrapper">
      <scroll
        ref="playList"
        class="list-scroll"
        :data="playHistory"
        v-show="playHistory.length > 0"
      >
        <div class="list-inner">
          <song-list :songs="playHistory" @insert="insertItem"></song-list>
        </div>
      </scroll>
      <div class="no-history" v-show="playHistory.length === 0">
        <p class="text">暂无播放历史！</p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import { listMixin } from "common/js/mixin"
export default {
  mixins: [listMixin],
  data() {
    return {
      currentIndex: 0
    }
  },
  computed: {
    ...mapGetters([
      'playList',
      'playHistory'
    ])
  },
  components: {
    SongList,
    Scroll
  },
  methods: {
    back() {
      this.$router.back()
    },
    playAll() {
      if (this.playHistory.length > 0) {
        this._getMusicUrl(this.playHistory[0].musicId).then(url => {
          console.log(url, 'playAll')
          this.playAllSongs({
            list: this.playHistory,
            url: url
          })
        })
      }
    },
    async _getMusicUrl(mid) {
      let url = ''
      try {
        let res = await this.$Http.MusicURL({
          id: mid
        })
        if (res.data) {
          url = res.data[0].url
        }
      } catch (error) {
        console.log(error)
        url = ''
      }
      return Promise.resolve(url)
    },
    insertItem(item) {
      this.addSong(item)
      if (this.playList.length === 1) {
        this.setCurrentIndex(0)
        this._getMusicUrl(this.playList[0].musicId).then(url => {
          this.setCurrentURL(url)
          if (!url) {
            this.setPlayingState(false)
          } else {
            this.setPlayingState(true)
            this.setFullScreen(true)
          }
        })
      }
    },
    deleteHistory() {
      this.clearPlayHistory()
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setCurrentURL: 'SET_CURRENT_URL',
      setPlayingState: 'SET_PLAYING_STATE',
      setFullScreen: 'SET_FULLSCREEN'
    }),
    handleList(playList) {
      const bottom = playList.length > 0 ? '50px' : ''
      this.$refs.listWrapper.style.bottom = bottom
      this.$refs.playList.refresh()
    },
    ...mapActions([
      'playAllSongs',
      'addSong',
      'clearPlayHistory'
    ])
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.user-center
  position fixed
  top 0
  bottom 0
  z-index 100
  width 100%
  background $color-theme
  &.slide-enter-active, &.slide-leave-active
    transition all 0.3s
  &.slide-enter, &.slide-leave-to
    transform translate3d(100%, 0, 0)
  .header
    height 40px
    width 100%
    background-color $color-background
    .icon-back
      position absolute
      top 0
      left 0
      z-index 50
      display block
      padding 10px
      font-size $font-size-large-x
      color $color-theme
    .title
      margin 0 auto
      width 80%
      no-wrap()
      text-align center
      line-height 40px
      font-size $font-size-medium-x
      color $color-theme
  .sub-head
    display flex
    align-items center
    justify-content space-between
    height 40px
    background-color $color-light-background
    box-sizing border-box
    padding 0 10px
    width 100%
    .play-btn
      padding 10px
      color $color-word-ll
      font-size 0
      .icon-play
        display inline-block
        vertical-align middle
        margin-right 6px
        font-size $font-size-medium-x
      .text
        display inline-block
        vertical-align middle
        font-size $font-size-small
    .delete-btn
      padding 10px
      .icon-clear
        font-size $font-size-large
        color $color-word-l
  .list-wrapper
    position absolute
    top 80px
    bottom 0
    width 100%
    .list-scroll
      height 100%
      overflow hidden
      .list-inner
        padding 0
    .no-history
      width 100%
      height 50px
      text-align center
      .text
        font-size $font-size-medium
        color $color-word-l
        line-height 50px
</style>