<template>
		<view class="swiper">
			<view class="swiper-box">
				<swiper circular="true" autoplay="true" @change="swiperChange">
					<swiper-item v-for="swiper in swiperList" :key="swiper.id"><image :src="swiper.img"/></swiper-item>
				</swiper>
				<view class="indicator"><view class="dots" v-for="(swiper, index) in swiperList" 
					:class="[currentSwiper >= index ? 'on' : '']" :key="index"></view></view>
			</view>
		</view>
</template>

<script>
	export default {
		data() {
			return {
				currentSwiper: 0,	
			}
		},
		
		props: {
			swiperList: Array,
		},	
		
		methods: {
			//轮播图指示器
			swiperChange(event) {
				this.currentSwiper = event.detail.current;
			},
		},
	}		
</script>

<style lang="scss">
	
.swiper {
	width: 100%;
	margin-top: 10upx;
	display: flex;
	justify-content: center;
	.swiper-box {
		width: 100%;
		height: 35vw;
		position: relative;
		z-index: 1;
		swiper {
			width: 100%;
			height: 35vw;
			swiper-item {
				width: 100%;
				height: 100%;
				padding: 0 28upx;
				box-sizing: border-box;
				overflow: hidden;
				image {
					width: 100%;
					height: 35vw;
					border-radius: 10upx;
				}
			}
		}
		.indicator {
			position: absolute;
			bottom: 20upx;
			left: 50%;
			transform: translateX(-50%);
			background-color: rgba(255, 255, 255, 0.4);
			width: 150upx;
			height: 5upx;
			border-radius: 3upx;
			overflow: hidden;
			display: flex;
			.dots {
				width: 0upx;
				background-color: rgba(255, 255, 255, 1);
				transition: all 0.3s ease-out;
				&.on {
					width: (100%/3);
				}
			}
		}
	}
}	
	
	
	
</style>
