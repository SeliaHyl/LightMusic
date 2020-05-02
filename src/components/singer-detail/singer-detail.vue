<template>
  <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
</template>
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { songList } from 'common/js/song'
import MusicList from 'components/music-list/music-list'
export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.imgUrl
    },
    ...mapGetters(['singer'])
  },
  created() {
    this._getSingerDetail()
  },
  components: {
    MusicList
  },
  methods: {
    async _getSingerDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      let res = await this.$Http.SingerDetail({
        id: this.singer.id
      })
      if (res.code === 200) {
        this.songs = this._normalizeSongs(res.songs)
      }
    },
    // 获取歌曲播放url
    async _getMusicUrl(mid) {
      let res = await this.$Http.MusicURL({
        id: mid
      })

      if (res.code === 200) {
        return Promise.resolve(res.data[0].url)
      } else {
        return ''
      }
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        let { name, id, al } = item
        this._getMusicUrl(id).then(url => {
          if (url !== null) {
            ret.push(
              new songList(
                id,
                name,
                url,
                al.id,
                al.name,
                al.picUrl,
                this.singer.id,
                this.singer.name,
                this.singer.imgUrl
              )
            )
          }
        })
      })
      return ret
    }
  }
}
</script>
<style scoped lang="stylus">
@import '~common/stylus/variable'
</style>