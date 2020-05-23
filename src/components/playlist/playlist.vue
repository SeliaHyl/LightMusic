<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <span>当前播放</span>
            <span class="total">({{playList.length}})</span>
          </h1>
          <div class="sub-title">
            <p class="change-mode" @click.stop="clickChangeMode">
              <i class="icon" :class="modeIcon"></i>
              <span class="text">{{modeText}}</span>
            </p>
            <i class="icon-clear" @click.stop="showComfirm"></i>
          </div>
        </div>
        <scroll ref="listContent" class="list-content" :data="sequenceList">
          <transition-group tag="ul" name="list">
            <li
              :key="item.musicId"
              ref="listItem"
              class="item"
              v-for="(item, index) in sequenceList"
              @click="selectItem(item, index)"
            >
              <i class="current" :class="getCurrentIcon(item)"></i>
              <p class="text" >
                <span class="name" :class="changeColor(item)">{{item.musicName}}</span>
                <span class="subname">-{{item.singerName}}</span>
              </p>
              <i class="icon-delete" @click.stop="deleteOne(item)"></i>
            </li>
          </transition-group>
        </scroll>
        <div @click="hide" class="list-close">
          <span>关闭</span>
        </div>
      </div>
      <delete-comfirm ref="comfirm" @comfirm="comfrimDeleteAll" text="是否清空当前播放列表？"></delete-comfirm>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { playMode } from 'common/js/play-mode'
import { playerMixin } from 'common/js/mixin'
import Scroll from 'base/scroll/scroll'
import DeleteComfirm from 'base/delete-comfirm/delete-comfirm'
export default {
  mixins: [playerMixin],
  data() {
    return {
      showFlag: false
    }
  },
  computed: {
    modeText() {
      if (this.mode === playMode.sequence) {
        return '顺序播放'
      } else if (this.mode === playMode.loop) {
        return '单曲循环'
      } else if (this.mode === playMode.random) {
        return '随机播放'
      }
    },
    ...mapGetters([
      "currentURL"
    ])
  },
  methods: {
    show() {
      this.showFlag = true
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToCurrent(this.currentSong)
      }, 20);
    },
    hide() {
      this.showFlag = false
    },
    getCurrentIcon(item) {
      if (this.currentSong.musicId === item.musicId) {
        return 'icon-play'
      }
      return ''
    },
    changeColor(item) {
      if(this.currentSong.musicId === item.musicId){
        return 'hightlight'
      }
      return ''
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
    selectItem(item, index) {
      if (this.mode === playMode.random) {
        index = this.playList.findIndex((song) => {
          return song.musicId === item.musicId
        })
      }
      this.setCurrentIndex(index)
      this._getMusicUrl(this.currentSong.musicId).then(url => {
        this.setCurrentURL(url)
        if (!url) {
          this.setPlayingState(false)
        } else {
          this.setPlayingState(true)
        }
      })
    },
    deleteOne(item) {
      this.deleteSong(item)
      this._getMusicUrl(this.currentSong.musicId).then(res => {
        this.setCurrentURL(res)
      })
      const playingState = this.playList.length > 0
      this.setPlayingState(playingState)
      if (!this.playList.length) {
        this.hide()
      }
    },
    showComfirm() {
      this.$refs.comfirm.show()
    },
    comfrimDeleteAll() {
      this.deleteAllSongs()
      this.$refs.comfirm.hide()
      this.hide()
    },
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex((song) => {
        return current.musicId === song.musicId
      })
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentURL: 'SET_CURRENT_URL'
    }),
    ...mapActions([
      'deleteSong',
      'deleteAllSongs'
    ])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return
      }
      this.scrollToCurrent(newSong)
    }
  },
  components: {
    Scroll,
    DeleteComfirm
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.playlist
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  z-index 200
  background-color $color-theme-d
  &.list-fade-enter-active, &.list-fade-leave-active
    transition opacity 0.3s
    .list-wrapper
      transition all 0.3s
  &.list-fade-enter, &.list-fade-leave-to
    opacity 0
    .list-wrapper
      transform translate3d(0, 100%, 0)
  &.list-fade-enter, .list-wrapper
    position absolute
    left 0
    bottom 0
    width 100%
    background-color $color-light-background
    border-radius 10px
    .list-header
      position relative
      padding 20px 30px 10px 20px
      .title
        line-height 20px
        font-weight 700
        font-size $font-size-medium-x
        color $color-word
        padding-bottom 7px
        .total
          font-size $font-size-medium
          color $color-word-ll
      .sub-title
        display flex
        align-items center
        justify-content space-between
        .change-mode 
          color $color-word-l
          .icon
            font-size $font-size-medium-x
          .text
            font-size $font-size-medium
        .icon-clear
          font-size $font-size-medium-x
          color $color-word-l
    .list-content
      max-height 240px
      overflow hidden
      .item
        display flex
        align-items center
        height 35px
        padding 0 30px 0 20px
        overflow hidden
        &.list-enter-active, &.list-leave-active
          transition all 0.1s
        &.list-enter, &.list-leave-to
          height 0
        .current
          width 14px
          font-size $font-size-medium
          color $color-background
        .text
          flex 1
          padding 0 10px
          no-wrap()
          .name
            font-size $font-size-medium
            color $color-word
            &.hightlight
              color $color-background
          .subname
            font-size $font-size-small
            color $color-word-l
        .icon-delete
          font-size $font-size-small
          color $color-word-l
    .list-close
      text-align center
      line-height 50px
      background $color-background
      font-size $font-size-medium
      color $color-theme
</style>