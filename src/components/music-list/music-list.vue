<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back" @click="back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter"></div>
    </div>
    <div class="play-content" ref="playBtn">
      <div class="player" v-show="songs.length>0">
        <i class="icon-play" @click="playAll"></i>
        <span class="text">播放全部</span>
      </div>
    </div>
    <scroll
      class="song-lists"
      :data="songs"
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      @scroll="scroll"
      ref="list"
    >
      <song-list @select="selectItem" :songs="songs"></song-list>
      <div class="loading-data" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script>
import SongList from "base/song-list/song-list"
import Scroll from "base/scroll/scroll"
import Loading from "base/loading/loading"
import { mapActions, mapGetters } from "vuex"
import { listMixin } from 'common/js/mixin'

const HEADER_HEIGHT = 78
const BUTTON_HEIGHT = 38
export default {
  mixins: [listMixin],
  props: {
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      scrollY: 0,
      mintranslateY: 0
    };
  },
  created() {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted() {
    this.bgImageHeight = this.$refs.bgImage.clientHeight
    this.mintranslateY = -this.bgImageHeight + HEADER_HEIGHT
    this.$refs.list.$el.style.top = `${this.bgImageHeight}px`
    this.$refs.playBtn.style.top = `${this.bgImageHeight - BUTTON_HEIGHT}px`
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    },
  },
  components: {
    SongList,
    Scroll,
    Loading
  },
  methods: {
    back() {
      this.$router.back()
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    async selectItem(item, index) {
      let res = await this.$Http.MusicURL({
        id: item.musicId
      })
      let url = ''
      if(res.data){
        url = res.data[0].url
        console.log(url,'selectPlay')
      }
      this.selectPlay({
        list: this.songs,
        index,
        url: url
      })
    },
    async playAll() {
      let res = await this.$Http.MusicURL({
        id: this.songs[0].musicId
      })
      let url = ''
      if(res.data){
        url = res.data[0].url
        console.log(url,'playAll')
      }
      this.playAllSongs({
        list: this.songs,
        url: url
      })
    },
    ...mapActions([
      "selectPlay",
      "playAllSongs"
    ]),
    handleList(playList) {
      const bottom = playList.length > 0 ? '50px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    }
  },
  watch: {
    scrollY(newY) {
      let zIndex = 0;
      //往上滑动时newY是负值
      if (newY < this.mintranslateY) {
        zIndex = 10
        this.$refs.bgImage.style.height = `${HEADER_HEIGHT}px`
      } else if (newY > this.mintranslateY && newY < 0) {
        let paddingTop = this.bgImageHeight + newY
        this.$refs.bgImage.style.height = `${paddingTop}px`
        this.$refs.playBtn.style.top = `${paddingTop - BUTTON_HEIGHT}px`
      }
      this.$refs.bgImage.style.zIndex = zIndex
    }
  }
};
</script>
<style scoped lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.music-list
  position fixed
  z-index 100
  top 0
  left 0
  bottom 0
  right 0
  background-color $color-theme
  .back
    position absolute
    top 0
    left 0
    z-index 50
    .icon-back
      display block
      padding 10px
      font-size $font-size-large-x
      color $color-theme
  .title
    position fixed
    top 0
    left 10%
    z-index 40
    width 80%
    no-wrap()
    text-align center
    line-height 40px
    font-size $font-size-medium-x
    color $color-theme
  .bg-image
    position relative
    width 100%
    height 45%
    background-size cover
    .filter
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      background rgba(7, 17, 27, 0.2)
  .play-content
    z-index 40
    position absolute
    width 100%
    background-color $color-theme-ll
    border-top-left-radius 15px
    border-top-right-radius 15px
    .player
      box-sizing border-box
      width 120px
      padding 10px 0
      text-align center
      color $color-word
      font-size 0
      .icon-play
        display inline-block
        vertical-align middle
        margin-right 8px
        font-size $font-size-large
      .text
        display inline-block
        vertical-align middle
        font-size $font-size-medium
  .song-lists
    position fixed
    top 0
    bottom 0
    width 100%
    .loading-data
      loading-data()
</style>