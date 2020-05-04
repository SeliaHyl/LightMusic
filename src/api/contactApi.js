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
  /*歌曲播放url*/
  MusicURL: {
    method: 'get',
    url: '/song/url'
  },
  /*获取歌词*/
  MusicLyric: {
    method: 'get',
    url: '/lyric'
  },
  /*推荐歌单详情*/
  PlaylistDetail: {
    method: 'get',
    url: '/playlist/detail'
  },
}

export default CONTACT_API