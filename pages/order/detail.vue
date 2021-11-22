<template>
	<view v-if="order != null">				
		<uni-card  :title="getTitle"  isShadow>		
			<orderAddres :list="is_list"  address_type="t" :address="order.daddress" />
			<orderAddres :list="is_list"  address_type="b" :address="order.baddress" />
			
		<view class="buy-list">
			<view class="row" v-for="(row, index) in order.orderGoods" :key="index">
				<view class="goods-info">
					<view class="img">
						<image :src="row.img"></image>
					</view>
					<view class="info">
						<view class="title">{{ row.goods_name }}</view>
						<view class="spec">{{ row.specs }}</view>
						<view class="price-number">
							<view class="price">€{{ row.goods_price }}</view>
							<view class="number">x{{ row.amount }}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="remark">
				<view class="row">
					<view class="left">买家留言</view>
					<view class="right">{{order.user_note}}</view>
				</view>
			</view>
		<view class="detail">
			<view class="row">
				<view class="nominal">商品金额</view>
				<view class="content">€{{ order.total_price | toFixed }}</view>
			</view>
			<view class="row">
				<view class="nominal">运费</view>
				<view class="content">€+{{ order.delivery_price | toFixed }}</view>
			</view>
			<view class="row">
				<view class="nominal">配送方式</view>
				<view class="content">{{ order.delivery_type_label }}</view>
			</view>
			<view class="row">
				<view class="nominal">订单生成日期</view>
				<view class="content">{{ order.confirm_time }}</view>
			</view>
			<view class="row">
				<view class="nominal">发货日期</view>
				<view class="content">{{ order.confirm_time }}</view>
			</view>
		</view>	
		</view>		
			
			

		</uni-card>

		<view class="blck"></view>
		<view class="footer">
			<view class="settlement">
				<view class="sum">
					合计:
					<view class="money">€{{ order.total_price | toFixed }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	import orderAddres from '@/components/home/order-address.vue'

	export default {
		components: {
			uniIcons,
			orderAddres
		},
		data() {
			return {
				is_list: false,
				order_id: 0,
				order: null,

			}
		},

		onLoad(e) {		
			this.order_id = e.order_id
            this.getOrder()
		},



		filters: {
			toFixed: function(x) {
				return parseFloat(x).toFixed(2);
			}
		},
		computed: {
	
			getTitle() {
				if(this.order != null){
					return this.order.order_sn + '['+this.order.status_text+']'
				}
				return ''
			},

		},
		
		methods: {
			getOrder() {
				this.$H.get(this.$A.m().appGetOrderDetail, {
					order_id: this.order_id
				}, {
					token: true
				}).then(res => {
					this.order = res
				})
			}

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
