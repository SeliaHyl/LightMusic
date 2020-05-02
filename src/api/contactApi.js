const CONTACT_API = {
	/*轮播图*/
	Banner: {
		method: 'get',
		url: '/banner'
	},
	/*热门歌单推荐*/
	HotPlayList: {
		method: 'get',
		url: '/top/playlist'
	},
	/*热门歌手*/
	HotSinger: {
		method: 'get',
		url: '/top/artists'
	},
	/*歌手的歌曲*/
	SingerDetail: {
		method: 'get',
		url: '/artist/top/song'
  },
  /*音乐的url*/
  MusicURL: {
    method: 'get',
    url: '/song/url'
  },
  /*获取歌词*/
  MusicLyric: {
    method: 'get',
    url: '/lyric'
  }
}

export default CONTACT_API