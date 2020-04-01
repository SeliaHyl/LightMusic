<template>
	<div class="recommend">
		<scroll class="recommend-wrapper" :data="playLists">
			<div class="recommend-wrapper-content">
				<slider class="slider-wrapper" :banners="banners"></slider>
				<div class="recommend-list">
					<h1 class="list-title">热门歌单推荐</h1>
					<ul>
						<li v-for="(item, index) in playLists" :key="index" class="item">
							<div class="icon">
								<img width="60" height="60" v-lazy="item.coverImgUrl" >
							</div>
							<div class="text">
								<h2 class="name" v-html="item.name"></h2>
								<p class="details">
									<span class="total">{{item.trackCount}}</span>首
									tags<span class="tags" v-if="item.tags.length>0" v-for="tag in item.tags">{{tag}}</span>
									<span class="tags" v-if="item.tags.length===0">无</span>
								</p>
							</div>
						</li>
					</ul>
				</div>
				<div class="loading-data" v-show="!playLists.length">
					<loading></loading>
				</div>
			</div>
		</scroll>
	</div>
</template>
<script>
	import Slider from 'base/slider/slider'
	import Scroll from 'base/scroll/scroll'
	import Loading from 'base/loading/loading'
	import axios from 'axios'
	export default {
		name: 'Recommend',
		data() {
			return {
				banners: [],
				playLists: []
			}
		},
		components: {
			Slider,
			Scroll,
			Loading
		},
		created() {
			this._getBanner()
			this._getPlayList()
		},
		methods: {
			//获取轮播图数据
			async _getBanner() {
				let res = await this.$Http.Banner({
					type: 2
				})
				if (res.code === 200) {
					this.banners = res.banners
		        }
			},
			//获取热门歌单数据
			async _getPlayList() {
				let res = await this.$Http.HotPlayList({
					order: 'undefined',
					limit: 30
				})
				if (res.code === 200) {
					this.playLists = res.playlists
		        }
			}
		}
	}
</script>
<style lang="stylus" scoped>
	@import "~common/stylus/variable"
	.recommend
		position fixed
		width 100%
		top 88px
		bottom 0
		.recommend-wrapper
			height 100%
			overflow hidden
			.recommend-wrapper-content
				.slider-wrapper
					width 98%
					margin 0 auto
				.recommend-list
					.list-title
						height 40px
						line-height 40px
						margin-left 10px
						font-size $font-size-medium
						color $color-theme
					.item
						display flex
						box-sizing border-box
						align-items center
						padding 0 20px 20px 20px
						.icon
							flex 0 0 60px
							width 60px
							padding-right 20px
						.text
							display flex
							flex-direction column
							justify-content center
							flex 1
							line-height 20px
							overflow hidden
							white-space nowrap
							text-overflow ellipsis
							.name
								font-size $font-size-medium
								margin-bottom 10px
								color $color-theme
							.details
								font-size $font-size-small
								color $color-theme-l
								.tags
									margin-right 2px
									margin-left 3px
				.loading-data
					position absolute
					width 100%
					top 50%
					transform translateY(-50%)
</style>