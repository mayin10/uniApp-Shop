<template>
	<!-- 左边w:373 h530 -->
	<!-- 右边w:375 h264  边h2-->
	<view class="img0">
		<image class="img1" :src="bigImg"></image>	
		<view class="img23">
			<image :src="smImg1" style="width: 375rpx;height: 264rpx;"></image>
			<image :src="smImg2" style="width: 375rpx;height: 264rpx;"></image>
		</view>	
	</view>
</template>

<script>
	export default {
		props:{			
		   bigImg:String,
		   smImg1:String,
		   smImg2:String,	  
		},
		methods:{
	
		}
	}
</script>

<style lang="scss">
	
	.img0{
		display: flex;
		.img1{
			width: 373rpx;
			height: 530rpx;						
		}
		.img23{
			display: flex;
			flex-direction: column!important;
		}
	}
	
</style>
