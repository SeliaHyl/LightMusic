<template>
  <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
</template>
<script>
import MusicList from 'components/music-list/music-list'
import axios from 'axios'
import { mapGetters } from 'vuex'
import { songDetail } from 'common/js/song'

export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.topList.name
    },
    bgImage() {
      return this.topList.imgUrl
    },
    ...mapGetters(['topList'])
  },
  created() {
    this.getToplistSongs()
  },
  methods: {
    getToplistSongs() {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      this.songs = this._normalizeSongs(this.topList.tracks)
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
        let { id, name, al, ar } = item
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
                ar[0].name,
                ''
              )
            )
          }
        })
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>
<style scoped lang="stylus"></style>