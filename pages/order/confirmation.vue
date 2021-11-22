<template>
	<view>
		
		<uni-card v-for="(item,indexc) in orderlist" :title="item.type_label" :key = "indexc" isShadow>				
			<orderAddres :list="is_list" :delivery_type="item.type" address_type="t" 
			   :address="item.delivery_address"  @selectAddress = "selectAddress"/>
			   
			<orderAddres :list="is_list" :delivery_type="item.type" address_type="b" 
			:address="item.bill_address"  @selectAddress = "selectAddress"/>	
			
			<view class="buy-list">				
				<view class="row" v-for="(row, index) in item.list" :key="index">
					<view class="goods-info">
						<view class="img">
							<image :src="row.img"></image>
						</view>
						<view class="info">
							<view class="title">{{ row.sku.goods_name }}</view>
							<view class="spec">{{ row.sku.specs }}</view>
							<view class="price-number">
								<view class="price">€{{ row.sku.price_1 }}</view>
								<view class="number">x{{ row.amount }}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="remark">
					<view class="row">
						<view class="left">买家留言</view>
						<view class="right"><input placeholder="选填,备注内容" v-model="item.note" /></view>
					</view>
				</view>
			</view>	
					<view class="detail">
						<view class="row">
							<view class="nominal">商品金额</view>
							<view class="content">€{{ item.totalPrice | toFixed }}</view>
						</view>
						<view class="row">
							<view class="nominal">运费</view>
							
							<view class="content">€+{{shipping_price | toFixed }}</view>
						</view>
						<view class="row">
							<view class="left">配送方式</view>
							<view class="right">{{item.type_label}}</view>
						</view>
					</view>
		</uni-card>
		
		
		
		<view class="blck"></view>
		<view class="footer">
			<view class="settlement">
				<view class="sum">
					合计:
					<view class="money">€{{ sumPrice | toFixed }}</view>
				</view>
				<view class="btn" @tap="toPay">去付款</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	import orderAddres from '@/components/home/order-address.vue'
	import {mapState,mapGetters} from "vuex"	
	export default {
		components: {
			uniIcons,orderAddres
		},
		data() {
			return {	
				is_list:false,
				shipFree: 49,				
				int: 3000, //抵扣积分
				coupon_price: 0, //抵扣价格
				paytype: 'wxpay', //支付类型				
			}
		},

		onLoad(e) {

				
		},
		computed: {
			...mapState({				
				userInfo: state => state.user.userInfo,			
			}),			
			...mapGetters([
				'totalPrice',
				'selectSum',
				'orderlist'				
			]),

			//用户付款价格	
			sumPrice() {
				return parseFloat(this.totalPrice) + parseFloat(this.shipping_price) - parseFloat(this.coupon_price);
			},
			shipping_price(){				
				if(this.totalPrice >= this.shipFree){
					return 0
				}
				return 0
			}
		},	
		filters: {
			toFixed: function(x) {
				return parseFloat(x).toFixed(2);
			}
		},
		methods: {										
			toPay() {							
				let list = []			
				this.orderlist.forEach(v=>{
					//type '1'=> '直邮中国', '2'=> '中国现货','3'=> '欧境快递','4'=> '大宗货运','5'=> '买家自取'
					let data={						
							type:v.type,
							default_delivery_address: v.delivery_address.id,
							default_bill_address:v.bill_address.id,
							total_price:v.totalPrice,
							delivery_price:this.shipping_price,
							coupon_price:this.coupon_price,						
							total_amount:v.totalAmount,
							user_note:v.user_note,
							cartId:v.cartId,
						}
					list.push(data)		
				})	
				let	payList = {user_id: this.userInfo.id, list: list}																			
				this.$H.post(this.$A.m().addOrder, payList, {
					token: true
				}).then(res => {					
					uni.$emit('updateCart')                   
					uni.redirectTo({				    			
					   url: '/pages/pay/payment/payment?amount=' + this.sumPrice +'&order_nr='+res
					})
					
				})
			},
			
			selectAddress(id, t1, t2){
				uni.navigateTo({
						url: '../user/address/address?type=select&delivery_type='+t1 +'&address_type='+t2						
				});
			},															
		}
	}
</script>

<style lang="scss">
	.block {
		width: 100%;
		padding: 10upx 3%;
		margin: 30upx auto 20upx auto;
		box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
		border-radius: 20upx;

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
				.row {
					width: 100%;
					height: 100upx;
					display: flex;
					align-items: center;

					.left {
						width: 80upx;
						flex-shrink: 0;
						display: flex;
						align-items: center;

						image {
							width: 60upx;
							height: 60upx;
						}
					}

					.center {
						width: 100%;
						font-size: 30upx;
					}

					.right {
						width: 80upx;
						flex-shrink: 0;
						display: flex;
						justify-content: flex-end;
					}
				}
			}
		}
	}

	.buy-list {
		width: 96%;
		padding: 10upx 3%;
		margin: 30upx auto 20upx auto;
		box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
		border-radius: 20upx;

		.row {
			margin: 30upx 0;
			.goods-info {
				width: 100%;
				display: flex;

				.img {
					width: 22vw;
					height: 22vw;
					border-radius: 10upx;
					overflow: hidden;
					flex-shrink: 0;
					margin-right: 10upx;

					image {
						width: 22vw;
						height: 22vw;
					}
				}

				.info {
					width: 100%;
					height: 22vw;
					overflow: hidden;
					display: flex;
					flex-wrap: wrap;
					position: relative;

					.title {
						width: 100%;
						font-size: 28upx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						// text-align: justify;
						overflow: hidden;
					}

					.spec {
						font-size: 22upx;
						background-color: #f3f3f3;
						color: #a7a7a7;
						height: 40upx;
						display: flex;
						align-items: center;
						padding: 0 10upx;
						border-radius: 20upx;
						margin-bottom: 20vw;
					}

					.price-number {
						position: absolute;
						width: 100%;
						bottom: 0upx;
						display: flex;
						justify-content: space-between;
						align-items: flex-end;
						font-size: 28upx;
						height: 40upx;

						.price {
							color: #f52c38;
						}

						.number {
							display: flex;
							justify-content: center;
							align-items: center;
						}
					}
				}
			}
		}
	}

	.remark {
		margin: 30upx auto 20upx auto;

		.row {
			margin: 20upx 0;
			height: 40upx;
			display: flex;

			.left {
				font-size: 28upx;
				flex-shrink: 0;
			}

			.right {
				margin-left: 40upx;
				font-size: 26upx;
				color: #999;
				display: flex;
				align-items: center;
				flex-grow: 1;

				&.marginal {
					margin-left: auto;
					color: #000;
					flex-grow: 0;
				}

				input {
					font-size: 26upx;
					color: #999;
					width: 100%;
				}
			}
		}
	}

	.order {
		width: 96%;
		padding: 10upx 3%;
		margin: 30upx auto 20upx auto;
		box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
		border-radius: 20upx;

		.row {
			margin: 20upx 0;
			height: 40upx;
			display: flex;
			align-items: center;

			.left {
				font-size: 28upx;
			}

			.right {
				margin-left: auto;
				font-size: 26upx;
				color: #000;
				display: flex;
				align-items: center;
			}
		}
	}

	.blck {
		width: 100%;
		height: 100upx;
	}

	.footer {
		width: 92%;
		padding: 0 4%;
		background-color: #fbfbfb;
		height: 100upx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		font-size: 28upx;
		position: fixed;
		bottom: 0upx;
		z-index: 5;

		.settlement {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.sum {
				font-size: 28upx;
				margin-right: 10upx;
				display: flex;
				justify-content: flex-end;
				align-items: baseline;

				.money {
					font-weight: 600;
					font-size: 36upx;
					color: #d10409;
				}
			}

			.btn {
				padding: 0 30upx;
				height: 60upx;
				background-color: #f5291c;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 30upx;
				border-radius: 40upx;
			}
		}
	}

	.detail {
		width: 96%;
		padding: 10upx 3%;
		margin: 30upx auto 20upx auto;
		box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
		border-radius: 20upx;

		.row {
			height: 60upx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.nominal {
				font-size: 28upx;
			}

			.content {
				font-size: 26upx;
				color: #f06c7a;
			}
		}
	}
</style>
