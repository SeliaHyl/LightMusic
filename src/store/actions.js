import * as types from './mutation-types'

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.musicId === song.musicId
  })
}

export const selectPlay = function ({ commit }, { list, index, url}) {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PALYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_CURRENT_URL, url)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULLSCREEN, true)
}

export const playAllSongs = function ({ commit }, { list, url }) {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PALYLIST, list)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_CURRENT_URL, url)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULLSCREEN, true)
}

export const insertSong = function({commit, state}, { song, url }) {
  let playlist = state.playList.slice()
  let sequencelist = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  //记录当前歌曲
  let currentSong = playlist[currentIndex]
  //查找当前list里面有没有song
  let fpIndex = findIndex(playlist, song)
  currentIndex++
  //在playlist的currentIndex+1的地方插入song
  playlist.splice(currentIndex,0,song)
  //当前list之前有这首歌,删除之前的
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }
  //修改sequenceList
  //查找当前的歌曲有在sequence的索引+1,则是song应该插入的位置
  let currentsIndex = findIndex(sequencelist, currentSong) + 1
  //查找插入歌曲是否存在
  let fsIndex = findIndex(sequencelist, song)
  //插入歌曲
  sequencelist.splice(currentsIndex, 0, song)
  if (fsIndex > -1) {
    if (currentsIndex > fsIndex) {
      sequencelist.splice(fsIndex, 1)
    } else {
      sequencelist.splice(fsIndex + 1, 1)
    }
  }

  //提交commit
  commit(types.SET_PALYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequencelist)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_CURRENT_URL, url)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
