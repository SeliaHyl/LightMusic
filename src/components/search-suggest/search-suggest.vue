<template>
  <scroll class="search-suggest" ref="list">
    <div class="scroll-wrapper">
      <p class="suggest-tips" v-show="singers.length>0||playlists.length>0">你可能感兴趣</p>
      <div class="suggest-list">
        <div class="singer" v-for="item in singers" @click="selectSinger(item)">
          <img class="image" v-lazy="item.img1v1Url" />
          <p class="name">歌手:{{item.name}}</p>
        </div>
        <div class="playlist" v-for="item in playlists" @click="selectPlaylist(item)">
          <img class="image" v-lazy="item.coverImgUrl" />
          <p class="name">歌单:{{item.name}}</p>
        </div>
      </div>
      <p class="song-tips" v-show="songs.length>0">单曲</p>
      <div class="songlist" :key="index" v-for="(song,index) in songs" @click="selectSong(song)">
        <p class="name">{{song.musicName}}</p>
        <p class="text">{{song.singerName}} - {{song.albumName}}</p>
      </div>
      <p class="no-result" v-show="!singers.length&&!playlists.length&&!songs.length">暂无搜索结果！</p>
    </div>
  </scroll>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import { mapMutations, mapActions } from 'vuex'
import { listMixin } from 'common/js/mixin'
export default {
  mixins: [listMixin],
  props: {
    singers: {
      type: Array,
      default: []
    },
    playlists: {
      type: Array,
      default: []
    },
    songs: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      normalSong: []
    }
  },
  methods: {
    selectSinger(item) {
      let { id, name, img1v1Url } = item
      let singer = { id: id, name: name, imgUrl: img1v1Url }
      this.setSinger(singer)
      this.$router.push({
        path: `/singer/${singer.id}`
      })
    },
    selectPlaylist(item) {
      let { id, name, coverImgUrl } = item
      let recomlist = { id: id, name: name, coverImgUrl: coverImgUrl }
      this.setRecomlist(recomlist)
      this.$router.push({
        path: `/recommend/${item.id}`
      })
    },
    async selectSong(song) {
      let res = await this.$Http.MusicURL({
        id: song.musicId
      })
      let url = ''
      if (res.data) {
        url = res.data[0].url
        console.log(url, 'insertSong')
      }
      this.insertSong({
        song: song,
        url: url
      })
    },
    ...mapMutations({
      setSinger: 'SET_SINGER',
      setRecomlist: 'SET_RECOMLIST'
    }),
    ...mapActions([
      "insertSong"
    ]),
    handleList(playList) {
      const bottom = playList.length > 0 ? '50px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    }
  },
  components: {
    Scroll
  }
}
</script>
<style scoped lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.search-suggest
  position fixed
  top 50px
  left 0
  bottom 0
  width 100%
  overflow hidden
  background-color $color-theme
  z-index 50
  .scroll-wrapper
    .suggest-tips, .song-tips, .no-result
      line-height 20px
      font-size $font-size-small
      color $color-word-l
      padding 5px 10px 0 10px
    .suggest-list
      .singer, .playlist
        display flex
        align-items center
        width 100%
        box-sizing border-box
        padding 5px 15px
        .image
          display block
          width 40px
          height 40px
          border-radius 5px
        .name
          line-height 30px
          padding 0 10px
          font-size $font-size-medium
          color $color-word
    .songlist
      display flex
      flex-direction column
      flex 1
      justify-content center
      width 100%
      box-sizing border-box
      padding 10px 20px
      .name
        no-wrap()
        color #0c73c2
        font-size $font-size-medium
        padding-bottom 5px
      .text
        no-wrap()
        color $color-word-l
        font-size $font-size-small-s
</style>