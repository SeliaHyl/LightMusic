<template>
	<div class="singer">
		<list-view :data="singers"></list-view>
	</div>
</template>
<script>
	import axios from 'axios'
	import jsPinyin from 'js-pinyin'
	import ListView from 'base/listview/listview'

	let HOT_NAME = '热门'
	let HOT_SINGER_LEN = 10

	export default {
		name: "Singer",
		data() {
			return {
				singers: []
			}
		},
		components: {
			ListView
		},
		created() {
			this._getHotSinger()
		},
		methods: {
			//获取歌手数据
			async _getHotSinger() {
				let res = await this.$Http.HotSinger({
					offset: 0,
					limit: 100
				})
				if (res.code === 200) {
					let artists = res.artists
					artists.forEach(item => {
						let pinyins = jsPinyin.getFullChars(item.name)
						//获取歌手名首字母
						item.Findex = pinyins.toUpperCase().split("")[0]
					})
					this.singers = this._normalizeSinger(artists)
		        }
			},
			_normalizeSinger(list) {
				let map = {
					hot: {
						title: HOT_NAME,
						items: []
					}
				}
				list.forEach((item, index) => {
					if(index < HOT_SINGER_LEN) {
						map.hot.items.push({
							id: item.id,
							name: item.name,
							imgUrl: item.img1v1Url
						})
					}
					const key = item.Findex
					if(!map[key]) {
						map[key] = {
							title: key,
							items: []
						}
					}
					map[key].items.push({
						id: item.id,
						name: item.name,
						imgUrl: item.img1v1Url
					})
				})
				//处理map得到有序列表
				let hot = []
				let ret = []
				for(let key in map) {
					let val = map[key]
					if(val.title.match(/[a-zA-Z]/)) {
						ret.push(val)
					} else if(val.title === HOT_NAME) {
						hot.push(val)
					}
				}
				//sort()升序排列，charCodeAt()获得字符串编码
				ret.sort((a,b) => {
					return a.title.charCodeAt(0) - b.title.charCodeAt(0)
				})
				return hot.concat(ret)
			}
		}
	}
</script>
<style lang="stylus" scoped>
	.singer
		position fixed
		top 88px
		bottom 0
		width 100%
</style>