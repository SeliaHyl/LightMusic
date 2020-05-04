<template>
  <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
</template>
<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import MusicList from 'components/music-list/music-list'
import { songDetail } from 'common/js/song'
export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.recomlist.name
    },
    bgImage() {
      return this.recomlist.coverImgUrl
    },
    ...mapGetters([
      'recomlist'
    ])
  },
  created() {
    this._getPlaylistDetail()
  },
  methods: {
    //获取歌单详情
    async _getPlaylistDetail() {
      if(!this.recomlist.id) {
        this.$router.push('/recommend')
        return
      }
      let res = await this.$Http.PlaylistDetail({
        id: this.recomlist.id
      })
      if (res.code === 200) {
        this.songs = this._normalizeSongs(res.playlist.tracks)
      }
    },
    async _getMusicUrl(mid) {
      let res = await this.$Http.MusicURL({
        id: mid
      })
      return Promise.resolve(res.data[0])
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        let { name, id, ar, al } = item
        this._getMusicUrl(id).then(res => {
          if (res.url !== null) {
            ret.push(
              new songDetail(
                id,
                name,
                res.url,
                al.id,
                al.name,
                al.picUrl,
                ar[0].id,
                ar[0].name
              )
            )
          }
        })
      })
      return ret
    },
  },
  components: {
    MusicList
  }
}
</script>
<style scoped lang="stylus"></style>