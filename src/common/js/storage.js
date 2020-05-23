import storage from 'good-storage'

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 100
const SEARCH_KEYWORD = '__search__'
const SEARCH_KEYWORD_LENGTH = 10

function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (Object.is(index, 0)) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item.musicId === song.musicId
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

export function clearPlay() {
  storage.remove(PLAY_KEY)
  return []
}

export function saveSearchKeyword(key) {
  let keywords = storage.get(SEARCH_KEYWORD, [])
  insertArray(keywords, key, (item) => {
    return item === key
  }, SEARCH_KEYWORD_LENGTH)
  storage.set(SEARCH_KEYWORD, keywords)
  return keywords
}

export function loadSearchKeyword() {
  return storage.get(SEARCH_KEYWORD, [])
}

export function clearSearchKeyword() {
  storage.remove(SEARCH_KEYWORD)
  return []
}