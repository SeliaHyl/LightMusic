import { mapGetters } from 'vuex'

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