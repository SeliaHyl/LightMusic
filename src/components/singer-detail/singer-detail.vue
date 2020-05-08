<template>
  <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
</template>
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { songDetail } from 'common/js/song'
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
  activated() {
    this._getSingerDetail()
  },
  components: {
    MusicList
  },
  methods: {
    //获取歌手详情
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
      return Promise.resolve(res.data[0])
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        let { name, id, al } = item
        ret.push(
          new songDetail(
            id,
            name,
            al.id,
            al.name,
            al.picUrl,
            this.singer.id,
            this.singer.name,
            this.singer.imgUrl
          )
        )
      })
      return ret
    }
  }
}
</script>
<style scoped lang="stylus"></style>