<template>
	<view>
		<!-- 顶部导航 -->
		<view class="topTabBar" :style="{ position: headerPosition, top: headerTop }">
			<view class="grid" v-for="(grid, tbIndex) in orderType" :key="tbIndex" @tap="showType(tbIndex)">
				<view class="text" :class="[tbIndex == tabbarIndex ? 'on' : '']">{{ grid }}</view>
			</view>
		</view>
		<!-- 考虑非APP端长列表和复杂的DOM使用scroll-view会卡顿，所以漂浮顶部选项卡使用page本身的滑动 -->
		<view class="order-list">
			<view class="list">
				<view class="onorder" v-if="orderList.length == 0">
					<image src="../../../static/img/noorder.png"></image>
					<view class="text">没有相关订单</view>
				</view>
				
				<view class="row" v-for="(row, index) in orderList" :key="index">		
					<view class="type">{{row.status_text }} </view>
					<view class="order-info">
						<view class="left"><image :src="row.img"></image></view>
						<view class="right">							
							<view class="name">{{ row.order_sn }}</view>
							<view class="spec">{{ row.delivery_type_label }}</view>
							<view class="price-number" @click="toOrderDetail(row.id)">																
								<uni-tag :inverted="true" text="点击查看订单详情" type="success" />					
							</view>
						</view>
					</view>
					<view class="detail">
						<view class="number">共{{ row.total_amount}}件商品</view>
						<view class="sum">合计 <view class="price">{{ row.total_price }} €</view></view>																				
						<view class="nominal">(含运费 {{ row.delivery_price }} €)</view>
					</view>
					<view class="btns" v-if=" !(row.status == 20 ||row.status == 70)">
						<block v-if="row.type.type == 'unpaid'">
							<view class="default" @tap="cancelOrder(row)">取消订单</view>
							<view class="pay" @tap="toPayment(row)">去支付</view>
						</block>
						<block v-if="row.type == 'back'"><view class="default" @tap="remindDeliver(row)">提醒发货</view></block>
						<block v-if="row.type == 'unreceived'">
							<view class="default" @tap="showLogistics(row)">查看物流</view>
							<view class="pay">确认收货</view>
							<view class="pay">我要退货</view>
						</block>
						<block v-if="row.type == 'received'">
							<view class="default">评价</view>
							<view class="default">再次购买</view>
						</block>
						<block v-if="row.type == 'completed'"><view class="default">再次购买</view></block>
						<block v-if="row.type == 'refunds'"><view class="default">查看进度</view></block>
						<block v-if="row.type == 'cancelled'"><view class="default">已取消</view></block>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
import uniTag from "@/components/uni-tag/uni-tag.vue"	
import {mapState} from "vuex"	
export default {
	
	data() {
		return {
			headerPosition: 'fixed',
			headerTop: '0px',
			typeText: {
				unpaid: '等待付款',
				// back: '等待商家发货',
				unreceived: '商家已发货',
				received: '等待用户评价',
				completed: '交易已完成',
				refunds: '商品退货处理中',
				cancelled: '订单已取消'
			},
			orderType: ['全部', '待付款',  '待收货', '待评价', '退换货'],
			params: {},								
			orderList: [],	
			tabbarIndex: 0
		}
	},
	
	
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo,
		}),

	
	},
	onLoad(option) {	
		let tbIndex = parseInt(option.tbIndex) + 1;
		this.tabbarIndex = tbIndex;
		this.getOrderParams()
		this.getOrderList()
		//兼容H5下排序栏位置
		// #ifdef H5
		let Timer = setInterval(() => {
			let uniHead = document.getElementsByTagName('uni-page-head');
			if (uniHead.length > 0) {
				this.headerTop = uniHead[0].offsetHeight + 'px';
				clearInterval(Timer); //清除定时器
			}
		}, 1);
		// #endif
	},
	onPageScroll(e) {
		//console.log(e.scrollTop)
		return;
		//兼容iOS端下拉时顶部漂移
		this.headerPosition = e.scrollTop >= 0 ? 'fixed' : 'absolute';
	},
	methods: {
		showType(tbIndex) {
			this.tabbarIndex = tbIndex
			this.getOrderParams()
			this.getOrderList()
		},
		
		getOrderParams(){
			this.params ={user_id: this.userInfo.id,status:0}
			 //'10'=> '待付款', '20'=> '待发货','30'=> '待收货','40'=> '待评价','50'=> '已完成','60'=> '已取消', '70'=> '已退货', '80'=> '已退款',
			if(this.tabbarIndex == 1){
				this.$set(this.params, 'status', 10);
			}  else if(this.tabbarIndex == 2){
				this.$set(this.params, 'status', 30);
			} else if(this.tabbarIndex == 3){
				this.$set(this.params, 'status', 40);
			}else if(this.tabbarIndex == 4){
				this.$set(this.params, 'status', 70);
			}
			
			
		},
		getOrderList(){
			this.$H.get(this.$A.m().appOrderList,this.params,{token:true}).then(res => {
			this.orderList = res																																													
			})
		},
				
		showLogistics(row) {},
		remindDeliver(row) {
			uni.showToast({
				title: '已提醒商家发货'
			});
		},
		cancelOrder(row) {
			uni.showModal({
				title: '取消订单',
				content: '确定取消此订单？',
				success: res => {
					if (res.confirm) {
						console.log('用户点击确定');
						this.doCancelOrder(row.id);
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		doCancelOrder(id) {
				this.$H.post(this.$A.m().appCancelOrder, {id:id}, {
					token: true
				}).then(res => {
					uni.showToast({title: '订单已经取消'})
					this.getOrderList()
				})
		},
		toPayment(row) {
			uni.redirectTo({
			  url: '/pages/pay/payment/payment?amount=' + row.total_price +'&order_nr='+row.order_sn
			})
		},
		toOrderDetail(id){
			uni.redirectTo({
			  url: '/pages/order/detail?order_id=' + id
			})
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f3f3f3;
}
.topTabBar {
	width: 100%;
	position: fixed;
	top: 0;
	z-index: 10;
	background-color: #f8f8f8;
	height: 80upx;
	display: flex;
	justify-content: space-around;
	.grid {
		width: 20%;
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #444;
		font-size: 28upx;
		.text {
			height: 40upx;
			padding: 0 10upx;
			display: flex;
			align-items: center;
			&.on {
				color: #fff;
				border-radius: 30upx;
				background: linear-gradient(to right, #e6ce76, #c9a66a);
			}
		}
	}
}
.order-list {
	margin-top: 80upx;
	padding-top: 20upx;
	width: 100%;
	.list {
		width: 94%;
		margin: 0 auto;
		.onorder {
			width: 100%;
			height: 50vw;
			display: flex;		
			justify-content: center;
			align-content: center;
			flex-wrap: wrap;
			image {
				width: 20vw;
				height: 20vw;
				border-radius: 100%;
			}
			.text {
				width: 100%;
				height: 60upx;
				font-size: 28upx;
				color: #444;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
		.row {
			width: calc(100% - 40upx);
			padding: 10upx 20upx;
			border-radius: 10upx;
			background-color: #fff;
			margin-bottom: 20upx;
			.type {
				font-size: 26upx;
				color: #ec652f;
				// height: 50upx;
				// display: flex;
				// align-items: center;
				text-align: right;
			}
			.order-info {
				width: 100%;
				display: flex;
				.left {
					flex-shrink: 0;
					width: 25vw;
					height: 25vw;
					image {
						width: 25vw;
						height: 25vw;
						border-radius: 10upx;
					}
				}
				.right {
					width: 100%;
					margin-left: 10upx;
					position: relative;
					.name {
						width: 100%;
						font-size: 28upx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
					.spec {
						color: #a7a7a7;
						font-size: 22upx;
					}
					.price-number {
						position: absolute;
						bottom: 0;
						width: 100%;
						display: flex;
						justify-content: flex-end;
						font-size: 22upx;
						color: #333;
						display: flex;
						align-items: flex-end;
						.price {
							font-size: 24upx;
							margin-right: 5upx;
						}
					}
				}
			}
			.detail {
				display: flex;
				justify-content: flex-end;
				align-items: flex-end;
				height: 60upx;
				font-size: 26upx;
				.sum {
					padding: 0 8upx;
					display: flex;
					align-items: flex-end;
					.price {
						font-size: 30upx;
					}
				}
			}
			.btns {
				height: 80upx;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				view {
					min-width: 120upx;
					height: 50upx;
					padding: 0 20upx;
					border-radius: 50upx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 28upx;
					margin-left: 20upx;
				}
				.default {
					border: solid 1upx #ccc;
					color: #666;
				}
				.pay {
					border: solid 1upx #ec652f;
					color: #ec652f;
				}
			}
		}
	}
}
</style>
