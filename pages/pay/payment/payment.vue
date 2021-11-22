<template>
	<view>
		<view class="block">
			<view class="content">
				<view class="orderinfo">										
						<view v-for= "(item,index) in getOrder" :key="index" class="row">
							<view class="nominal">订单号:</view>
							<view class="text">{{item}}</view>							
						</view>																																									
					<view class="row">
						<view class="nominal">订单金额:</view>
						<view class="text">{{amount}} Euro</view>
					</view>
				</view>
			</view>
		</view>
		<view class="block">
			<view class="title">
				选择支付方式
			</view>
			<view class="content">
				<view class="pay-list">				
				<view class="row" v-for="(item,index) in pay" :key="index" @tap="paytype=item.paytype">
						<view class="left"><image :src="item.img"></image></view>													
						<view class="center">{{item.text}}</view>												
						<view class="right"><radio :checked="paytype==item.paytype" color="#d5a02b" /></view>													
					</view>														
				</view>
			</view>
		</view>

		<view v-if= "paytype!='bank'" class="pay">
			<view class="btn" @tap="toPaynow">立即支付</view>
			<view class="tis">
				点击立即支付，即代表您同意<view class="terms">
					《条款协议》
				</view>
			</view>
		</view>
	
		<view v-if= "paytype=='bank'" class="back"><view class="btn" @tap="toUser">个人中心</view></view>
	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				paytype:'',
				pay: [ 
					{img:'/static/img/pay/bank.png',text:'银行转账', paytype:'bank'},
					{img:'/static/img/pay/alipay.png',text:'支付宝支付', paytype:'alipay'},
					{img:'/static/img/pay/wxpay.png',text:'微信支付', paytype:'wxpay'},
				],
				
				amount: 0,
				order_nr: '',
				paytype: 'wxpay', 
				param_order_nr:'',

			};
		},
		onLoad(e) {		
			this.order_nr =e.order_nr
			console.log(this.order_nr)
			this.amount = parseFloat(e.amount).toFixed(2);
		},
		computed: {
			getOrder(){
				if(this.order_nr.length >1){
					return this.order_nr.split(',')
				}
				
			}
		
		},
		methods: {
			toUser() {
				uni.switchTab({
					url: '/pages/tabBar/user/user'
				});
			},
			toPaynow() {
				uni.redirectTo({
					url: '../../pay/payment/paynow/paynow?amount='+this.amount +'&order_nr='+ this.order_nr					 
				});
			},			
		}
	}
</script>

<style lang="scss">
	.block {
		width: 94%;
		padding: 0 3% 40upx 3%;
		.title {
			width: 100%;
			font-size: 34upx;
		}

		.content {
			.orderinfo {
				width: 100%;
				border-bottom: solid 1upx #eee;
				.row {
					width: 100%;
					height: 90upx;
					display: flex;
					align-items: center;

					.nominal {
						flex-shrink: 0;
						font-size: 32upx;
						color: #7d7d7d;
					}

					.text {
						width: 70%;
						margin-left: 10upx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						font-size: 32upx;
					}
				}
			}

			.pay-list {
				width: 100%;
				border-bottom: solid 1upx #eee;

				.row {
					width: 100%;
					height: 120upx;
					display: flex;
					align-items: center;

					.left {
						width: 100upx;
						flex-shrink: 0;
						display: flex;
						align-items: center;

						image {
							width: 80upx;
							height: 80upx;
						}
					}

					.center {
						width: 100%;
						font-size: 30upx;
					}

					.right {
						width: 100upx;
						flex-shrink: 0;
						display: flex;
						justify-content: flex-end;
					}
				}
			}
		}
	}

	.pay {
		margin-top: 20upx;
		width: 100%;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;

		.btn {
			width: 80%;
			height: 80upx;
			border-radius: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			background-color: #e11d24;
			box-shadow: 0upx 5upx 10upx rgba(0, 0, 0, 0.2);
		}

		.tis {
			margin-top: 10upx;
			width: 100%;
			font-size: 24upx;
			display: flex;
			justify-content: center;
			align-items: baseline;
			color: #999;
			.terms {
				color: #5a9ef7;
			}
		}
	}
	
	.back{
		margin-top: 20upx;		
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		.btn{
			padding: 0 200upx;
			height: 70upx;
			border: solid 2upx #8b6945;
			color: #8b6945;
			align-items: center;
			border-radius: 20upx;
			font-size: 34upx;
		}
	}
</style>
