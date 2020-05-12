import state from "./state"

export const singer = state => state.singer

export const recomList = state => state.recomList

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playList = state => state.playList

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}

export const topList = state => state.topList

export const currentURL = state => state.currentURL

export const playHistory = state => state.playHistory