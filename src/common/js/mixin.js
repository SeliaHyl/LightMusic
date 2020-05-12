import { mapActions, mapGetters, mapMutations } from 'vuex'
import { playMode } from 'common/js/play-mode'

export const listMixin = {
  computed: {
    ...mapGetters(['playList'])
  },
  mounted() {
    this.handleList(this.playList)
  },
  activated() {
    this.handleList(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handleList(this.playList)
    }
  },
  methods: {
    handleList(list) {
      console.log('改变scroll-list的bottom值')
    }
  },
}

export const playerMixin = {
  computed: {
    modeIcon() {
      if (this.mode === playMode.sequence) {
        return 'icon-sequence'
      } else if (this.mode === playMode.loop) {
        return 'icon-loop'
      } else if (this.mode === playMode.random) {
        return 'icon-random'
      }
    },
    ...mapGetters([
      "currentSong",
      "mode",
      "playList",
      "sequenceList",
    ])
  },
  methods: {
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
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setMode: 'SET_MODE',
      setPlayList: 'SET_PALYLIST',
    })
  }
}