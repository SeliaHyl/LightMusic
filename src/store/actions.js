import * as types from './mutation-types'

export const selectPlay = function({commit, state}, {list, index}) {
  commit(types.SET_PALYLIST, list)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING, true)
}