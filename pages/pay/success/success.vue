<template>
	<view>
		<view class="icon">			 
			<uni-icons v-if="type == 0" type="checkbox-filled" size="100" color="#04b809"></uni-icons>
		    <uni-icons v-if="type == 1" type="clear" size="100" color="#c10016"></uni-icons> 
		</view>
		<view class="tis">付款生成成功</view>					
		<view class="pay-amount">应付金额: {{amount}}€</view>		   		
		<view class="back"><view class="btn" @tap="toUser">个人中心</view></view>					
	</view>
</template>

<script>
	export default {
		data() {
			return {
				amount:0,
				type:0,
			};
		},
		onLoad(e) {
			this.amount = parseFloat(e.amount).toFixed(2)
			// this.type = e.type
		},
		methods: {
			toUser() {
				uni.switchTab({
					url: '/pages/tabBar/user/user'
				});
			}
		},
	}
</script>

<style lang="scss">
	view{
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
.icon{
	width: 100%;
	margin-top: 10vw;
	image{
		width: 25vw;
		height: 25vw;
	}
}
.tis{
	width: 100%;
	margin-top: 20upx;
	font-size: 48upx;
}
.pay-amount{
	width: 100%;
	margin-top: 10upx;
	font-size: 32upx;
}
.back{
	position: absolute;
	width: 100%;
	bottom: 80upx;
	.btn{
		padding: 0 100upx;
		height: 70upx;
		border: solid 2upx #8b6945;
		color: #8b6945;
		align-items: center;
		border-radius: 10upx;
		font-size: 34upx;
	}
}
</style>
