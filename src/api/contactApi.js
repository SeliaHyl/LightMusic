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
	singerDetail: {
		method: 'get',
		url: '/artist/top/song'
	}
}

export default CONTACT_API