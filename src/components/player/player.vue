<template>
  <div class="player" v-show="playList.length>0">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img width="100%" height="100%" v-lazy="currentSong.albumImg" />
      </div>
      <div class="top">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
      </div>
      <div class="middle">
        <div class="album-pic" ref="albumPic">
          <div class="pic">
            <img class="image" v-lazy="currentSong.albumImg" />
          </div>
        </div>
        <div class="song-title">
          <p class="title" v-html="currentSong.musicName"></p>
          <p class="subtitle" v-html="currentSong.singerName"></p>
        </div>
        <scroll class="lyric-wrapper" ref="lyricList" :data="currentLyric && currentLyric.lines">
          <div class="lyric-list">
            <div v-if="currentLyric">
              <p
                v-show="currentLyric.lines.length>0"
                class="text"
                ref="lyricLine"
                v-for="(line,index) in currentLyric.lines"
                :key="index"
                :class="{'current-line':index === currentLineNum}"
              >{{line.txt}}</p>
            </div>
          </div>
        </scroll>
        <div v-if="currentLyric">
          <p v-show="currentURL && currentLyric.lines.length===0" class="no-lyric">暂无歌词</p>
          <p v-show="!currentURL" class="no-lyric">无播放来源,暂时无法播放</p>
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
          <div class="icon i-right" @click.stop="showPlaylist">
            <i class="icon-playlist"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="mini-player" @click="open" v-show="!fullScreen">
      <div class="mini-img">
        <img width="40" height="40" v-lazy="currentSong.albumImg" />
      </div>
      <div class="text">
        <p class="name" v-html="currentSong.musicName"></p>
        <p class="desc" v-html="currentSong.singerName"></p>
      </div>
      <div class="control">
        <i @click.stop="controlPlaying" :class="miniPlayIcon"></i>
      </div>
      <div class="control" @click.stop="showPlaylist">
        <i class="icon-playlist"></i>
      </div>
    </div>
    <playlist ref="playlist"></playlist>
    <audio
      ref="audio"
      :src="songUrl"
      @canplay="canplay"
      @error="error"
      @timeupdate="updateTime"
      @ended="endMusic"
    ></audio>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import axios from 'axios'
import ProgressBar from 'base/progress-bar/progress-bar'
import { playMode } from 'common/js/play-mode'
import LyricParser from 'lyric-parser'
import Scroll from 'base/scroll/scroll'
import Playlist from 'components/playlist/playlist'
import { playerMixin } from 'common/js/mixin'

export default {
  mixins: [playerMixin],
  data() {
    return {
      songUrl: '',
      playLock: false,
      currentTime: 0,
      durationTime: 0,
      currentLyric: null,
      currentLineNum: 0,
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
    percent() {
      return this.currentTime / this.durationTime
    },
    ...mapGetters([
      "fullScreen",
      "playing",
      "currentIndex",
      "currentURL"
    ])
  },
  created() {
    this.touch = {}
    this.touch.init = false
  },
  methods: {
    back() {
      this.setFullScreen(false)
    },
    open() {
      this.setFullScreen(true)
    },
    controlPlaying() {
      if (!this.playLock) {
        return
      }
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
      this.playLock = true
    },
    prevSong() {
      if (!this.playLock) {
        return
      }
      if (this.playList.length === 1) {
        this.musicLoop()
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
        this._getMusicUrl(this.currentSong.musicId)
      }
    },
    nextSong() {
      if (!this.playLock) {
        return
      }
      if (this.playList.length === 1) {
        this.musicLoop()
      } else {
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        this._getMusicUrl(this.currentSong.musicId)
      }
    },
    canplay() {
      this.playLock = true
      this.savePlayHistory(this.currentSong)
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
      let currentTime = this.durationTime * percent
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    endMusic() {
      if (this.mode === playMode.loop) {
        this.musicLoop()
      } else {
        this.nextSong()
      }
    },
    musicLoop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
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
      this.setCurrentURL(url)
      if (!url) {
        this.setPlayingState(false)
      } else {
        this.setPlayingState(true)
      }
    },
    //歌词处理
    async _getMusicLyric(mid) {
      try {
        let res = await this.$Http.MusicLyric({
          id: mid
        })
        const lyricData = res.lrc.lyric
        this.currentLyric = new LyricParser(lyricData, this.handleLyric)
      } catch (error) {
        this.currentLyric = new LyricParser('暂无歌词', this.handleLyric)
      }
      if (this.playing) {
        this.currentLyric.play()
      }
    },
    //歌词高亮和滚动
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum
      if (lineNum > 2) {
        let lineEl = this.$refs.lyricLine[lineNum - 2]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
    },
    showPlaylist() {
      this.$refs.playlist.show()
    },
    ...mapMutations({
      setFullScreen: 'SET_FULLSCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentURL: 'SET_CURRENT_URL'
    }),
    ...mapActions([
      'savePlayHistory'
    ])
  },
  watch: {
    currentURL(newVal) {
      if (!newVal) {
        this.songUrl = ''
        this.$refs.audio.pause()
        this.$refs.audio.currentTime = 0
        this.setPlayingState(false)
        this.currentLyric = new LyricParser('暂时无法播放', this.handleLyric)
        setTimeout(() => {
          this.nextSong()
        }, 5000)
        return
      }
      //清空歌词计时器，解决歌词不断抖动
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      this.songUrl = newVal
      setTimeout(() => {
        this.$refs.audio.play()
        this._getMusicLyric(this.currentSong.musicId)
      }, 500);
    },
    currentSong(newSong, oldSong) {
      if (!newSong) {
        return
      }
      if (newSong.musicId === oldSong.musicId) {
        return
      }
    },
    playing(newPlaying) {
      this.$nextTick(() => {
        newPlaying ? this.$refs.audio.play() : this.$refs.audio.pause()
      })
    }
  },
  components: {
    ProgressBar,
    Scroll,
    Playlist
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
      opacity 0.4
      filter blur(35px)
    .top
      position relative
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
    .middle
      position fixed
      width 100%
      bottom 100px
      top 40px
      left 0
      right 0
      .album-pic
        position relative
        width 100%
        height 60%
        .pic
          margin 0 auto
          width 84%
          height 100%
          box-sizing border-box
          .image
            width 100%
            height 100%
            border-radius 3%
      .song-title
        width 100%
        margin 0 auto
        height 40px
        text-align center
        margin 5px 0
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
      .lyric-wrapper
        position relative
        height 30%
        width 100%
        overflow hidden
        .lyric-list
          width 80%
          margin 0 auto
          overflow hidden
          text-align center
          .text
            line-height 27px
            color $color-theme-l
            font-size $font-size-medium
            &.current-line
              color $color-theme
      .no-lyric
        line-height 28px
        position absolute
        top 80%
        left 50%
        transform translateX(-50%)
        color $color-theme-l
        font-size $font-size-medium
    .bottom
      position absolute
      bottom 20px
      left 0
      width 100%
      box-sizing border-box
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
  .mini-player
    display flex
    align-items center
    position fixed
    left 0
    bottom 0
    z-index 200
    height 50px
    background $color-background
    width 100%
    .mini-img
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
      .icon-play-mini, .icon-pause-mini
        font-size 30px
        color $color-theme-ll
      .icon-playlist
        font-size 26px
        color $color-theme-ll
</style>