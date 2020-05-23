import * as types from './mutation-types'
import { savePlay, clearPlay, saveSearchKeyword, clearSearchKeyword } from 'common/js/storage'

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.musicId === song.musicId
  })
}

export const selectPlay = function ({commit}, {list, index, url}) {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_CURRENT_URL, url)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULLSCREEN, true)
}

export const playAllSongs = function ({commit}, {list, url}) {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_CURRENT_URL, url)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULLSCREEN, true)
}

export const insertSong = function({commit, state}, {song, url}) {
  let playlist = state.playList.slice()
  let sequencelist = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  //记录当前歌曲
  let currentSong = playlist[currentIndex]
  //查找当前list里面有没有song
  let fpIndex = findIndex(playlist, song)
  currentIndex++
  //在playlist的currentIndex+1的地方插入song
  playlist.splice(currentIndex, 0, song)
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
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequencelist)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_CURRENT_URL, url)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
}

export const deleteAllSongs = function({commit}) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

export const addSong = function ({commit, state}, song) {
  console.log(song, 'addSong')
  let playlist = state.playList.slice()
  let sequencelist = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let currentSong = playlist[currentIndex]
  let fpIndex = findIndex(playlist, song)
  currentIndex++
  playlist.splice(currentIndex, 0, song)
  //当前list之前有这首歌,删除之前的
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currentsIndex = findIndex(sequencelist, currentSong) + 1
  let fsIndex = findIndex(sequencelist, song)
  sequencelist.splice(currentsIndex, 0, song)
  if (fsIndex > -1) {
    if (currentsIndex > fsIndex) {
      sequencelist.splice(fsIndex, 1)
    } else {
      sequencelist.splice(fsIndex + 1, 1)
    }
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequencelist)
}

export const savePlayHistory = function ({commit, state}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const clearPlayHistory = function ({ commit }) {
  commit(types.SET_PLAY_HISTORY, clearPlay())
}

export const saveSearchHistory = function ({commit, state}, keyword) {
  commit(types.SET_SEARCH_HISTORY, saveSearchKeyword(keyword))
}

export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearchKeyword())
}
