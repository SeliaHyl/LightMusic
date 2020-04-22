const palyMode = {
  sequence: 0,
  loop: 1,
  random: 2
}

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  // 歌曲顺序列表
  sequenceList: [],
  // 播放模式
  mode: palyMode.sequence,
  // 当前播放歌曲index
  currentIndex: -1
}

export default state