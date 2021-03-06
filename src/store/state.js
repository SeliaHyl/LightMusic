import { playMode } from 'common/js/play-mode'
import { loadPlay, loadSearchKeyword } from 'common/js/storage'

const state = {
  singer: {},
  // 推荐歌单数据
  recomList: {},
  playing: false,
  fullScreen: false,
  playList: [],
  // 歌曲顺序列表
  sequenceList: [],
  // 播放模式
  mode: playMode.sequence,
  // 当前播放歌曲index
  currentIndex: -1,
  // 排行榜数据
  topList: {},
  currentURL: '',
  playHistory: loadPlay(),
  searchHistory: loadSearchKeyword()
}

export default state