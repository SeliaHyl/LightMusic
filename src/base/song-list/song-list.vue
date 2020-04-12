<template>
	<div class="songs">
		<ul>
			<li v-for="(item,index) in songs"
				:key="item.musicId"
				class="item" 
			>
				<p class="rank">{{index+1}}</p>
				<div class="text">
					<h2 class="name">{{item.musicName}}</h2>
					<p class="detail">{{getAlbum(item)}}</p>
				</div>
			</li>
		</ul>
	</div>
</template>
<script>
	export default {
		props: {
			songs: {
				type: Array,
				default: []
			}
		},
		methods: {
			getAlbum(item) {
				return `${item.singerName} - ${item.albumName}`
			}
		}
	}
</script>
<style scoped lang="stylus">
	@import "~common/stylus/variable"
	@import "~common/stylus/mixin"
	.songs
		.item
			display flex
			box-sizing border-box
			padding 3px 0
			background-color $color-background
			.rank
				width 50px
				height 50px
				line-height 50px
				text-align center
				color $color-theme
				font-size $font-size-medium
			.text
				display flex
				flex-direction column
				justify-content center
				flex 1
				line-height 20px
				overflow hidden
				.name
					no-wrap()
					color $color-theme
					font-size $font-size-medium
				.detail
					no-wrap()
					color $color-theme-l
					font-size $font-size-small-s
						
</style>