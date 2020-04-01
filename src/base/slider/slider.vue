<template>
	<div class="swiper-content" v-if="reRender">
		<swiper class="swiper-group" :options="swiperOption" v-if="banners.length>1">
			<swiper-slide v-for="item in banners" :key="item.bannerId" class="swiper-item-wrapper">
				<a  class="swiper-item" :href="item.url">
					<img :src="item.pic"/>
				</a>
			</swiper-slide>
			<div class="swiper-pagination" slot="pagination"></div>
		</swiper>
	</div>
</template>
<script>
	import "swiper/dist/css/swiper.css"
	import {swiper, swiperSlide} from "vue-awesome-swiper"
	export default {
		name: "Slider",
		props: {
			banners: {
				type: Array,
				default() {
					return []
				}
			}
		},
		data() {
			return {
				reRender: false,
				swiperOption: {
					speed: 500, //切换速度
					loop: true, //循环模式
					sliderPerView: 1, //设置slider容器能够同时显示的slides数量
					spaceBetween: 10, 
					autoplay: {
						delay: 2000,
						disableOnInteraction: false, //用户操作swiper之后，是否禁止autoplay
					},
					preventClicksPropagation: true, //拖动swiper时阻止click事件
					simulateTouch: false, //鼠标模拟手机触摸。默认为true，Swiper接受鼠标点击、拖动
					pagination: {
						el: ".swiper-pagination",
						type: "bullets"
					} //分页器设置
				}
			}
		},
		activated() {
			this.reRender = false
			setTimeout(() => {
				this.reRender = true
			}, 100)
		},
		components: {
			swiper,
			swiperSlide
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable"
	.swiper-content
		width 100%
		height 180px
		.swiper-group
			display flex
			.swiper-item-wrapper
				.swiper-item
					display block
					width 100%
					img
						border-radius 10px
						width 100%
						height 180px
						overflow hidden
			.swiper-pagination
				bottom 2px
				>>>.swiper-pagination-bullet-active
					background: rgba(228, 220, 221, 0.8)
		
</style>