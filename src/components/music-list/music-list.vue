<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back" @click="back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-content" ref="playBtn">
        <div class="palyer" v-show="songs.length>0">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter"></div>
    </div>
    <scroll
      class="song-lists"
      :data="songs"
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      @scroll="scroll"
      ref="list"
    >
      <div class="song-lists-content">
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
      <div class="loading-data" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script>
import SongList from "base/song-list/song-list";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { mapActions } from "vuex";
const HEADER_HEIGHT = 70;
export default {
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
    this.probeType = 3;
    this.listenScroll = true;
  },
  mounted() {
    this.bgImageHeight = this.$refs.bgImage.clientHeight;
    this.mintranslateY = -this.bgImageHeight + HEADER_HEIGHT;
    this.$refs.list.$el.style.top = `${this.bgImageHeight}px`;
    let btnTop = this.bgImageHeight - 30;
    this.$refs.playBtn.style.top = `${btnTop}px`;
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  components: {
    SongList,
    Scroll,
    Loading
  },
  methods: {
    back() {
      this.$router.back();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        index
      });
    },
    ...mapActions([
      "selectPlay"
    ])
  },
  watch: {
    scrollY(newY) {
      let zIndex = 0;
      if (newY <= this.mintranslateY) {
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = `${HEADER_HEIGHT}px`;
      } else if (newY > this.mintranslateY && newY < 0) {
        let paddingTop = this.bgImageHeight + newY;
        this.$refs.bgImage.style.paddingTop = `${paddingTop}px`;
        this.$refs.bgImage.style.height = 0;
        let btnTop = paddingTop - 30;
        this.$refs.playBtn.style.top = `${btnTop}px`;
      }
      this.$refs.bgImage.style.zIndex = zIndex;
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
  background-color $color-background
  .back
    position absolute
    top 0
    left 6px
    z-index 50
    .icon-back
      display block
      padding 9px
      font-size $font-size-large-x
      color $color-theme
  .title
    position absolute
    top 0
    left 10%
    z-index 40
    width 80%
    no-wrap()
    text-align center
    line-height 40px
    font-size $font-size-large
    color $color-theme
  .bg-image
    position relative
    width 100%
    height 0
    padding-top 70%
    transform-origin top
    background-size cover
    .play-content
      z-index 40
      width 100%
      position absolute
      background-color $color-background
      border-top-left-radius 14px
      border-top-right-radius 14px
      .palyer
        box-sizing border-box
        width 150px
        padding 7px 0
        text-align center
        color $color-theme
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
    .filter
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      background rgba(7, 17, 27, 0.4)
  .bg-layer
    position relative
    height 100%
    background-color $color-background
  .song-lists
    position fixed
    top 0
    bottom 0
    width 100%
    background-color $color-background
    .song-lists-content
      padding 0px
    .loading-data
      position absolute
      width 100%
      height 50%
      transform translateY(-50%)
</style>