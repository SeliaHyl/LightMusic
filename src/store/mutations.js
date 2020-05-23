import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.SET_RECOMLIST](state, list) {
    state.recomList = list
  },
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  [types.SET_FULLSCREEN](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state, list) {
    state.playList = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },
  [types.SET_TOPLIST](state, list) {
    state.topList = list
  },
  [types.SET_CURRENT_URL](state, url) {
    state.currentURL = url
  },
  [types.SET_PLAY_HISTORY](state, playhistory) {
    state.playHistory = playhistory
  },
  [types.SET_SEARCH_HISTORY](state, seahistory) {
    state.searchHistory = seahistory
  }
}

export default mutations