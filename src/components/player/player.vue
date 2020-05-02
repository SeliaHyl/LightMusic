<template>
  <div class="player" v-show="playList.length>0">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img width="100%" height="100%" :src="currentSong.albumImg" />
      </div>
      <div class="top">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <div class="top-title">
          <p class="title" v-html="currentSong.musicName"></p>
          <p class="subtitle" v-html="currentSong.singerName"></p>
        </div>
      </div>
      <div class="middle">
        <div class="middle-l">
          <div class="cd-wrapper">
            <div class="cd">
              <img class="image" :src="currentSong.albumImg" />
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="progress-wrapper">
          <span class="time time-l">{{format(currentTime)}}</span>
          <div class="progress-bar-wrapper">
            <progress-bar :percent="percent" @progressChange="progressChange"></progress-bar>
          </div>
          <span class="time time-r">{{format(durationTime)}}</span>
        </div>
        <div class="operators">
          <div class="icon i-left" @click="clickChangeMode">
            <i :class="modeIcon"></i>
          </div>
          <div class="icon i-left" :class="disableClass">
            <i @click="prevSong" class="icon-prev"></i>
          </div>
          <div class="icon i-center" :class="disableClass">
            <i @click="controlPlaying" :class="playIcon"></i>
          </div>
          <div class="icon i-right" :class="disableClass">
            <i @click="nextSong" class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i class="icon-not-favorite"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="mini-player" @click="open" v-show="!fullScreen">
      <div class="icon">
        <img width="40" height="40" :src="currentSong.albumImg" />
      </div>
      <div class="text">
        <p class="name" v-html="currentSong.musicName"></p>
        <p class="desc" v-html="currentSong.singerName"></p>
      </div>
      <div class="control">
        <i @click.stop="controlPlaying" :class="miniPlayIcon"></i>
      </div>
      <div class="control">
        <i class="icon-playlist"></i>
      </div>
    </div>
    <audio
      ref="audio"
      :src="songUrl"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="endMusic"
    ></audio>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex"
import axios from 'axios'
import ProgressBar from 'base/progress-bar/progress-bar'
import { playMode } from 'common/js/play-mode'
import LyricParser from "lyric-parser"

export default {
  data() {
    return {
      songUrl: '',
      playLock: false,
      currentTime: 0,
      durationTime: 0,
      lyric: null
    }
  },
  computed: {
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniPlayIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    disableClass() {
      return this.playLock ? '' : 'disable'
    },
    modeIcon() {
      if (this.mode === playMode.sequence) {
        return 'icon-sequence'
      } else if (this.mode === playMode.loop) {
        return 'icon-loop'
      } else if (this.mode === playMode.random) {
        return 'icon-random'
      }
    },
    percent() {
      return this.currentTime / this.durationTime
    },
    ...mapGetters([
      "fullScreen",
      "playList",
      "currentSong",
      "playing",
      "currentIndex",
      "mode",
      "sequenceList"
    ])
  },
  methods: {
    back() {
      this.setFullScreen(false)
    },
    open() {
      this.setFullScreen(true)
    },
    controlPlaying() {
      this.setPlayingState(!this.playing)
      let playing = this.playing
      playing ? this.$refs.audio.play() : this.$refs.audio.pause()
    },
    prevSong() {
      if (!this.playLock) {
        return
      }
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playList.length - 1
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
      this.playLock = false
    },
    nextSong() {
      if (!this.playLock) {
        return
      }
      let index = this.currentIndex + 1
      if (index === this.playList.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
      this.playLock = false
    },
    ready() {
      this.playLock = true
    },
    error() {
      this.playLock = true
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime
      this.durationTime = e.target.duration
    },
    format(interval) {
      interval = interval | 0
      let minute = interval / 60 | 0
      minute = minute > 9 ? minute : '0' + minute
      let second = interval % 60
      second = second > 9 ? second : '0' + second
      return `${minute}:${second}`
    },
    progressChange(percent) {
      this.$refs.audio.currentTime = this.durationTime * percent
      if (!this.playing) {
        this.controlPlaying()
      }
    },
    clickChangeMode() {
      const mode = (this.mode + 1) % 3
      this.setMode(mode)
      let list = []
      if (mode === playMode.random) {
        list = this.listRandom(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.musicId === this.currentSong.musicId
      })
      console.log(index)
      this.setCurrentIndex(index)
    },
    listRandom(list) {
      let copyList = list.slice()
      copyList = copyList.sort(() => {
        return Math.random() - 0.5
      })
      return copyList
    },
    endMusic() {
      if (this.mode === playMode.loop) {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
      } else {
        this.nextSong()
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULLSCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setMode: 'SET_MODE',
      setPlayList: 'SET_PALYLIST'
    }),
    //歌词处理
    async _getMusicLyric(mid) {
      let res = await this.$Http.MusicLyric({
        id: mid
      })
      try{
        const lyricData = res.lrc.lyric
        this.lyric = new LyricParser(lyricData)
        console.log(this.lyric)
      } catch(error) {
        this.lyric = new LyricParser('暂无歌词')
        console.log(this.lyric)
      }
    }
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (newSong.musicId === oldSong.musicId) {
        return
      }

      this.songUrl = this.currentSong.musicURL
      console.log(this.songUrl, 'ppp')

      this._getMusicLyric(this.currentSong.musicId)

      this.$nextTick(() => {
        this.$refs.audio.play()
      })
    },
  },
  components: {
    ProgressBar
  }
};
</script>
<style scoped lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.player
  .normal-player
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    z-index 120
    background $color-background
    .background
      position absolute
      left 0
      top 0
      width 100%
      height 100%
      z-index -1
      opacity 0.5
      filter blur(25px)
    .top
      position relative
      margin-top 5px
      .back
        position absolute
        top 0
        left 0
        z-index 50
        transform rotate(-90deg)
        .icon-back
          display block
          padding 9px
          font-size $font-size-large-x
          color $color-theme
      .top-title
        width 70%
        margin 0 auto
        height 40px
        text-align center
        .title
          line-height 25px
          color $color-text
          no-wrap()
          font-size $font-size-medium-x
        .subtitle
          line-height 15px
          color $color-text-l
          no-wrap()
          font-size $font-size-small-s
    .middle
      position fixed
      width 100%
      bottom 170px
      top 60px
      white-space nowrap
      font-size 0
      .middle-l
        display inline-block
        vertical-align top
        position relative
        width 100%
        height 0
        padding-top 80%
        .cd-wrapper
          position absolute
          left 10%
          top 0
          width 80%
          height 100%
          .cd
            width 100%
            height 100%
            box-sizing border-box
            .image
              position absolute
              left 0
              top 0
              width 100%
              height 100%
              border-radius 3%
    .bottom
      position absolute
      bottom 50px
      width 100%
      .progress-wrapper
        display flex
        align-items center
        width 80%
        margin 0 auto
        padding 5px 0
        .time
          color $color-theme
          font-size $font-size-small
          flex 0 0 30px
          line-height 30px
          width 30px
          &.time-l
            text-align left
            padding-right 10px
          &.time-r
            text-align right
            padding-left 10px
        .progress-bar-wrapper
          flex 1
      .operators
        display flex
        align-items center
        .icon
          flex 1
          color $color-theme
          &.disable
            color $color-theme-d
          i
            font-size 30px
        .i-left
          text-align right
        .i-center
          padding 0 20px
          text-align center
          i
            font-size 35px
        .i-right
          text-align left
        .icon-favorite
          color $color-theme
  .mini-player
    display flex
    align-items center
    position fixed
    left 0
    bottom 0
    z-index 200
    height 60px
    background $color-background
    border 1px solid red
    width 100%
    .icon
      flex 0 0 40px
      width 40px
      padding 0 10px 0 15px
      img
        border-radius 50%
    .text
      display flex
      justify-content center
      flex-direction column
      flex 1
      line-height 20px
      overflow hidden
      .name
        font-size $font-size-medium
        no-wrap()
        color $color-text
      .desc
        font-size $font-size-small-s
        no-wrap()
        color $color-text-d
    .control
      flex 0 0 30px
      width 30px
      padding 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size 30px
        color $color-theme-ll
      .icon-mini
        font-size 32px
        position absolute
        left 0
        top 0
</style>