<template>
	<div>
		推荐页面
	</div>
</template>
<script>
	import {getRecommend} from 'api/recommend'
	import {ERR_OK} from 'api/config'
	export default {
		name: 'Recommend',
		created() {
			this._getRecommend()
		},
		methods: {
			_getRecommend() {
				getRecommend().then((res) => {
					if (res.code === ERR_OK) {
						console.log(res.data.slider)
					}
				})
			}
		}
	}
</script>
<style lang="stylus" scoped>
	
</style>