<template>
  <transition name="searches">
    <div class="search" ref="search">
      <div class="search-header">
        <div class="icon" @click="back">
          <i class="icon-back"></i>
        </div>
        <div class="search-input">
          <input type="text" class="input" :placeholder="placeholders" v-model="keyWords" />
          <i class="icon-dismiss" v-show="keyWords" @click="clear"></i>
        </div>
      </div>
      <scroll class="search-content" :data="searchData" ref="searchList" v-show="!isShow">
        <div>
          <div class="history" v-show="searchHistory.length>0">
            <div class="title">
              <span class="text">最近搜索</span>
              <span class="clear" @click="showComfirm">清空</span>
            </div>
            <div class="keywords">
              <p
                class="word"
                @click="selectItem(item)"
                v-for="(item,index) in searchHistory"
                :key="index"
              >{{item}}</p>
            </div>
          </div>
          <div v-show="hotSearchs" class="hot-search">
            <p class="title">热搜榜</p>
            <ul>
              <li
                class="item"
                v-for="(item,index) in hotSearchs"
                :key="index"
                @click="selectItem(item)"
              >
                <p class="rank" :class="{'high-light': index < 3}">{{index+1}}</p>
                <div class="text">
                  <p class="word" :class="{'high-light': index < 3}">{{item.searchWord}}</p>
                  <p class="content">{{item.content}}</p>
                </div>
                <p class="score">{{item.score}}</p>
              </li>
            </ul>
            <div class="loading-data" v-show="!hotSearchs.length">
              <loading></loading>
            </div>
          </div>
        </div>
      </scroll>
      <delete-comfirm ref="comfirm" @comfirm="comfrimDelete" text="是否清空搜索历史？"></delete-comfirm>
      <search-suggest v-show="isShow" :singers="singers" :playlists="playlists" :songs="songs"></search-suggest>
    </div>
  </transition>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import DeleteComfirm from 'base/delete-comfirm/delete-comfirm'
import Loading from 'base/loading/loading'
import SearchSuggest from 'components/search-suggest/search-suggest'
import { mapGetters, mapActions } from 'vuex'
import { songDetail } from 'common/js/song'
import { listMixin } from 'common/js/mixin'
export default {
  mixins: [listMixin],
  data() {
    return {
      placeholders: '搜索歌曲、歌手',
      keyWords: '',
      hotSearchs: [],
      singers: [],
      playlists: [],
      songs: [],
      isShow: false
    }
  },
  computed: {
    searchData() {
      return this.hotSearchs.concat(this.searchHistory)
    },
    ...mapGetters(['searchHistory'])
  },
  created() {
    this._gethotSearchs()
    this.$watch('keyWords', this.debounce((newVal) => {
      if (newVal) {
        console.log(newVal)
        this.singers = []
        this.playlists = []
        this.songs = []
        this._getSearchResult(newVal)
        this.saveSearchHistory(newVal)
      } else {
        this.isShow = false
        this.$refs.searchList.refresh()
      }
    }, 200)
    )
  },
  methods: {
    back() {
      this.$router.back()
    },
    clear() {
      this.keyWords = ''
      this.isShow = false
    },
    async _gethotSearchs() {
      let res = await this.$Http.SearchHot()
      if (res.code === 200) {
        this.hotSearchs = res.data
      }
    },
    async _getSearchResult(key) {
      let songRes = await this.$Http.SearchSong({
        keywords: key
      })
      if (songRes.code === 200 && songRes.result.songs) {
        this.songs = this._normalizeSongs(songRes.result.songs)
      }
      let suggestRes = await this.$Http.SearchSuggest({
        keywords: key
      })
      if (suggestRes.result.artists) {
        this.singers = suggestRes.result.artists
      }
      if (suggestRes.result.playlists) {
        this.playlists = suggestRes.result.playlists
      }
      this.isShow = true
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        let { name, id, artists, album } = item
        ret.push(
          new songDetail(
            id,
            name,
            album.id,
            album.name,
            artists[0].img1v1Url,
            artists[0].id,
            artists[0].name,
            artists[0].img1v1Url
          )
        )
      })
      return ret
    },
    async _getMusicUrl(mid) {
      let res = await this.$Http.MusicURL({
        id: mid
      })
      return Promise.resolve(res.data[0])
    },
    selectItem(item) {
      if (item.searchWord) {
        this.keyWords = item.searchWord
      } else {
        this.keyWords = item
      }
    },
    //input节流函数
    debounce(func, delay) {
      let timer
      return function (...args) {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          func.apply(this, args)
        }, delay)
      }
    },
    showComfirm() {
      this.$refs.comfirm.show()
    },
    comfrimDelete() {
      this.clearSearchHistory()
      this.$refs.comfirm.hide()
    },
    ...mapActions([
      'saveSearchHistory',
      'clearSearchHistory'
    ]),
    handleList(playList) {
      const bottom = playList.length > 0 ? '50px' : ''
      this.$refs.searchList.$el.style.bottom = bottom
      this.$refs.searchList.refresh()
    }
  },
  components: {
    Scroll,
    DeleteComfirm,
    SearchSuggest,
    Loading
  },
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.searches-enter, .searches-leave-to
  transform translate3d(-100%)
.searches-enter-active, .searches-leave-active
  transition all 0.3s linear
.search
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  background-color $color-theme
  z-index 100
  .search-header
    position relative
    z-index 50
    height 50px
    width 100%
    background-color $color-background
    .icon
      position absolute
      top 4px
      left 0
      .icon-back
        display block
        padding 10px
        font-size $font-size-large-x
        color $color-theme
    .search-input
      position absolute
      bottom 10px
      left 15%
      width 70%
      display flex
      align-items center
      .input
        width 100%
        outline none
        box-sizing border-box
        border-top none
        border-left none
        border-right none
        border-bottom 1px solid $color-theme-l
        background-color $color-background
        font-size $font-size-medium-x
        color $color-text
        padding 3px
        &::-webkit-input-placeholder
          color $color-text-l
        &:focus
          border-bottom 1px solid $color-theme
      .icon-dismiss
        display block
        font-size $font-size-large
        color $color-text-l
  .search-content
    position fixed
    top 50px
    bottom 0
    width 100%
    overflow hidden
    .history
      width 100%
      .title
        padding-top 10px
        height 20px
        display flex
        justify-content space-between
        line-height 20px
        .text
          font-size $font-size-small
          color $color-word-l
          padding 0 10px
        .clear
          font-size $font-size-small
          color red
          padding 0 10px
      .keywords
        display flex
        flex-wrap wrap
        justify-content left
        .word
          margin 5px
          padding 5px 10px
          border-radius 10px
          font-size $font-size-small
          color $color-word-l
          background-color $color-light-background
          &:hover
            background-color $color-word
    .hot-search
      width 100%
      .title
        line-height 20px
        color $color-word-l
        font-size $font-size-small
        padding 15px 0 0 10px
      .item
        display flex
        box-sizing border-box
        align-items center
        padding 5px 10px
        .rank
          width 45px
          height 45px
          line-height 45px
          text-align center
          color $color-word-l
          font-size $font-size-medium
          flex 0 0 45px
          &.high-light
            color red
        .text
          display flex
          flex-direction column
          justify-content center
          flex 1
          line-height 20px
          overflow hidden
          .word
            no-wrap()
            color $color-word
            font-size $font-size-medium
            padding-bottom 2px
            &.high-light
              font-weight 600
          .content
            no-wrap()
            color $color-word-l
            font-size $font-size-small-s
        .score
          line-height 30px
          text-align center
          no-wrap()
          color $color-word-l
          font-size $font-size-small-s
          flex 0 0 70px
      .loading-data
        loading-data()
</style>