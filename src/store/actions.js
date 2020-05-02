import * as types from './mutation-types'

export const selectPlay = function ({ commit }, { list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PALYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULLSCREEN, true)
}

export const playAllSongs = function ({ commit }, { list }) {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PALYLIST, list)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULLSCREEN, true)
}
