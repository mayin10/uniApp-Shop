<template>
	<view>		
        <view v-if="cartList.length == 0">
			<view class="noCart"  @click="toHome">
				<image src="../../../static/img/myShop/cart.png"></image>
				<view class="text">
					购物车还是为空, 快去逛一逛
				</view>
			</view>
			<goodsList :title="title" :productList="productList" :loadingText="loadtext"></goodsList>
		</view>

		<view v-else>
			<view v-if="cartList.length>0" class="goods-list">
				<uni-card v-for="(item,indexc) in cartList" :title="item.delivery_type_label" isShadow :key="indexc">
					<view class="row" v-for="(row,index) in item.list" :key="index">
						<view class="carrier" :class="[theIndex==index?'open':oldIndex==index?'close':'']">
							<view class="checkbox-box" @tap="selectItem(row.id)">
								<uni-icons :type="row.is_selected == 1? 'checkbox':'circle'" size="20" color="#dc2436">
								</uni-icons>
							</view>
							<view class="goods-info">
								<view class="img">
									<image :src="row.img"></image>
								</view>
								<view class="info">
									<view class="title" @tap="toGoods(row)">{{row.sku.goods_name}}</view>
									<view class="spec"><text>{{row.sku.specs}}</text></view>

									<view class="price-number">
										<view class="price"> €{{row.sku.price_1}}</view>
										<view class="number">
											<view class="sub" @tap.stop="sub(row)">
												<view class="icon jian"></view>
											</view>
											<view class="input">
												<input type="number" v-model="row.amount" :disabled="true" />
											</view>
											<view class="add" @tap.stop="add(row)">
												<view class="icon jia"></view>
												
											</view>
										</view>
										<view @click="delCart(row, item.list,indexc)">											
											<view style="font-size: small; color: #2C405A;" class="icon shanchu"/>																				
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</uni-card>
			</view>

			<!-- 脚部菜单 -->
			<view class="footer" :style="{bottom:footerbottom}">
				<view class="checkbox-box" @tap="doSelectAll">
					<uni-icons :type="checkedAll? 'checkbox': 'circle'" size="20" color="#dc2436"></uni-icons>
					<view class="text">全选</view>
				</view>
				<view class="settlement">
					<view class="total">
						<view class="sum">合计:<view class="money">€ {{totalPrice}}</view>
						</view>
					</view>
					<view class="btn" @tap="toConfirmation">结算({{selectSum}})</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	import uniCard from "@/components/uni-card/uni-card.vue"
	import goodsList from '@/components/home/goods-list.vue'
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	export default {
		components: {
			//uniIcons,
			uniCard,
			goodsList
		},
		data() {
			return {
				imglogo:'../../../static/img/myShop/logo.png',
				imgBg:'../../../static/img/myShop/loginBg.png',
				title: "猜你喜欢",
				loadtext: "上拉加载更多",
				page: 1,
				total: 0,
				productList: [],
				headerPosition: "fixed",
				headerTop: null,
				statusTop: null,
				showHeader: true,
				footerbottom: 0,
				//控制滑动效果
				theIndex: null,
				oldIndex: null,
				isStop: false,
				modelIndex: '',
			}
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo,
				cartList: state => state.cart.cartlist,
				addressList: state => state.cart.addressList,
			}),
			...mapGetters([
				'checkedAll',
				'totalPrice',
				'selectSum',
				'orderlist',
			])

		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			this.headerPosition = e.scrollTop >= 0 ? "fixed" : "absolute";
			this.headerTop = e.scrollTop >= 0 ? null : 0;
			this.statusTop = e.scrollTop >= 0 ? null : -this.statusHeight + 'px';
		},
		beforeDestroy() {
			uni.$off('updateCart')
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.getData()
			this.getProductList()
			uni.stopPullDownRefresh()
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			if(this.cartList.length == 0){
				uni.showToast({
					title: '触发上拉加载'
				});
				if (this.loadtext !== '上拉加载更多') return;
				this.loadtext = '加载中...'
				this.page++
				this.getProductList(false)	
			}

		},
		onLoad() {
			// #ifdef H5
			this.footerbottom = document.getElementsByTagName('uni-tabbar')[0].offsetHeight + 'px';
			// #endif
			this.getData()
			uni.setNavigationBarTitle({
				title: '我的购物车'
			});
			this.getProductList()
		},
		onShow(){
			//uni.$emit('updateCart')			
		},
		methods: {
			...mapActions([
				'doSelectAll',
				'doDelGoods',
				'updateCartList'
			]),
			...mapMutations([
				'selectItem',
				'updateBadge',
				'initCartList',
				'unSelectAll'
			]),

			// 获取数据
			getData() {
				this.updateCartList()
			},

			toHome() {
				uni.switchTab({
					url: '/pages/tabBar/home/home'
				});
			},
			
			getProductList(refresh = true, callback = false) {
				let page = refresh ? 1 : this.page
				this.$H.get(this.$A.m().productList, {
					page: page,
				}).then(res => {
					this.total = res.data.total
					let list = this.format(res.data)
					this.productList = refresh ? [...list] : [...this.productList, ...list],
						this.loadtext = res.data.length < 6 ? '到底了' : '上拉加载更多'
					if (typeof callback === 'function') {
						callback()
					}
				})
			},
			format(res) {
				return res.map(item => {
					return {
						goods_id: item.id,
						img: item.img,
						name: item.name,
						price: item.price,
						slogan: item.sale_count + 10 + '人付款',
						tags: item.tags
					}
				})
			},
			//商品跳转
			toGoods(e) {
				//console.log(JSON.stringify(e))
				uni.navigateTo({
					//url: '../../goods/goods?goods_id=' + e.id
				});
			},
			//跳转确认订单页面
			toConfirmation() {
				if (this.orderlist.length < 1) {
					uni.showToast({
						title: '请选择商品结算',
						icon: 'none'
					})
					return
				}
				if (this.addressList.length == 0) {
					uni.navigateTo({
						url: '../../user/address/edit/edit?type=cart'
					})
				} else {
					uni.navigateTo({
						url: '../../order/confirmation'
					})
				}
			},

			// 减少数量
			sub(cart) {
				if (cart.amount > 1) {
					cart.amount--
					this.changeNum(cart.id, cart.amount)
				}
			},
			// 增加数量
			add(cart) {
				let check = true
				if (cart.delivery_type == 2) {
					if (cart.amount >= cart.sku.store_cn - 1) {
						check = false
						uni.showToast({
							title: '中国库存不足',
							icon: 'none'
						});
					}

				} else {
					if (cart.amount >= cart.sku.store_de - 1) {
						check = false
						uni.showToast({
							title: '德国库存不足',
							icon: 'none'
						});
					}
				}
				if (check) {
					cart.amount++
					this.changeNum(cart.id, cart.amount)
				}
			},

			changeNum(id, number) {
				let data = {
					id: id,
					number: number
				}
				this.$H.post(this.$A.m().changeNum, data, {
					token: true
				}).then(res => {
					this.$U.updateCartBadge(this.selectSum)
					//this.updateBadge
				})
			},

			delCart(cart, list, indexc) {
				let index1 = null
				list.forEach((item, index) => {
					if (item.id == cart.id) {
						index1 = index
					}
				});
				if (index1 != null) {
					list.splice(index1, 1)
				}
				if (list.length == 0) {
					this.cartList.splice(indexc, 1)
				}

				let data = {
					id: cart.id
				}
				this.$H.post(this.$A.m().delCart, data, {
					token: true
				}).then(res => {
					this.$U.updateCartBadge(this.selectSum)
				})
			},

		}
	}
</script>
<style lang="scss">
@import '../../../static/css/login.scss';	
	page {
		position: relative;
		background-color: #fff;
		
	}

	.noCart {
		width: 100%;
		height: 70vw;
		display: flex;
		justify-content: center;
		align-content: center;
		flex-wrap: wrap;
		border: solid 1upx #fff;
		background-color: #f2f2f2;

		image {
			width: 15vw;
			height: 15vw;
			border-radius: 10%;
		}

		.text {
			width: 100%;
			height: 60upx;
			margin: 20upx;
			font-size: 30upx;
			color: #444;
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 1;

		}
	}




	.goods-list {
		width: 100%;
        margin-bottom: 200upx;
		.tis {
			width: 100%;
			height: 60upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
		}

		.row {
			width: calc(100%);
			height: calc(22vw + 40upx);
			margin: 20upx auto;

			border-radius: 15upx;
			box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
			display: flex;
			align-items: center;
			position: relative;
			overflow: hidden;
			z-index: 4;
			border: 0;

			.menu {
				.icon {
					color: #fff;
					// font-size: 25upx;
				}

				position: absolute;
				width: 30%;
				height: 100%;
				right: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: red;
				color: #fff;
				z-index: 2;
			}

			.carrier {
				@keyframes showMenu {
					0% {
						transform: translateX(0);
					}

					100% {
						transform: translateX(-30%);
					}
				}

				@keyframes closeMenu {
					0% {
						transform: translateX(-30%);
					}

					100% {
						transform: translateX(0);
					}
				}

				&.open {
					animation: showMenu 0.25s linear both;
				}

				&.close {
					animation: closeMenu 0.15s linear both;
				}

				background-color: #fff;

				.checkbox-box {
					padding-left: 20upx;
					flex-shrink: 0;
					height: 22vw;
					margin-right: 20upx;
				}

				position: absolute;
				width: 100%;
				padding: 0 0;
				height: 100%;
				z-index: 3;
				display: flex;
				align-items: center;

				.goods-info {
					width: 100%;
					display: flex;
					padding-right: 10upx;

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
							font-size: 20upx;
							background-color: #f3f3f3;
							color: #a7a7a7;
							height: 40upx;
							display: flex;
							align-items: center;
							padding: 0 16upx;
							max-width: 400upx;
							border-radius: 15upx;
							margin-bottom: 20vw;
							overflow: hidden;

							text {
								text-overflow: ellipsis;
								overflow: hidden;
								white-space: nowrap;
							}
						}

						.price-number {
							position: absolute;
							width: 100%;
							bottom: 0upx;
							display: flex;
							justify-content: space-between;
							align-items: flex-end;
							font-size: 28upx;
							height: 60upx;

							.price {
								color: #ff0000;
							}

							.number {
								display: flex;
								justify-content: center;
								align-items: flex-end;

								.input {
									width: 60upx;
									height: 44upx;
									margin: 0 10upx;
									background-color: #f3f3f3;

									input {
										width: 60upx;
										height: 44upx;
										display: flex;
										justify-content: center;
										align-items: center;
										text-align: center;
										font-size: 26upx;
									}
								}

								.sub,
								.add {
									width: 45upx;
									height: 45upx;
									background-color: #f3f3f3;
									border-radius: 5upx;

									.icon {
										font-size: 22upx;
										width: 45upx;
										height: 45upx;
										display: flex;
										justify-content: center;
										align-items: center;

									}
								}
							}
						}
					}
				}
			}
		}
	}

	.footer {
		width: 92%;
		padding: 0 4%;
		background-color: #fbfbfb;
		height: 100upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28upx;
		position: fixed;
		bottom: 0upx;
		z-index: 5;

		.delBtn {
			border: solid 1upx #f06c7a;
			color: #f06c7a;
			padding: 0 30upx;
			height: 50upx;
			border-radius: 30upx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.settlement {
			width: 60%;
			display: flex;
			justify-content: flex-end;
			align-items: center;

			.total {

				.sum {
					// width: 50%;
					font-size: 28upx;
					margin-right: 10upx;
					display: flex;
					justify-content: flex-end;

					.money {
						font-weight: 600;
					}
				}

				.rest {
					color: #666;
				}
			}

			.btn {
				width: 200upx;
				height: 80upx;
				background-color: #dc2935;
				border-radius: 50upx;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}

	.configBox {
		.taxContent {
			padding: 0 20rpx;
			height: 1000rpx;
			background-color: #fff;

			.popupClose {
				position: absolute;
				right: 20rpx;
				top: 20rpx;
			}

			.topBox {
				display: flex;
				align-items: center;
				padding: 20rpx 0;

				.imgBox {
					border-radius: 20rpx;
					border: 2rpx solid #eee;
					width: 180rpx;
					overflow: hidden;

					image {
						width: 100%;
						display: block;
					}
				}

				.cont {
					padding-left: 20rpx;
					box-sizing: border-box;

					.money {
						color: #ff4422;
						margin: 10rpx 0;
					}

					.title {
						font-size: 24rpx;
						color: #666;
						height: 115rpx;
						overflow: hidden;
						-webkit-line-clamp: 3;
						-webkit-box-orient: vertical;
						display: -webkit-box;
						text-overflow: ellipsis;
					}
				}
			}

			.clearfix::after {
				content: "";
				display: block;
				clear: both;
				visibility: hidden;
				line-height: 0;
				height: 0;
				font-size: 0;
			}

			.innerBox {
				overflow: scroll;
				height: 500rpx;

				// &::-webkit-scrollbar {
				// 	display: none;
				// }
				.configBox {
					height: 100%;

					.title {
						font-size: 30rpx;
						padding: 10rpx 0;
					}

					.configList {
						height: 100%;

						.listItem {
							font-size: 28rpx;
							border: 2rpx solid #f5f5f5;
							background: #f6f6f6;
							height: auto;
							line-height: 1.5;
							padding: 2rpx 4rpx;
							float: left;
							display: flex;
							align-items: center;
							margin: 10rpx;
							border-radius: 20rpx;
							padding: 5rpx 20rpx;
							box-sizing: border-box;
							overflow: hidden;

							&:active {
								border: 2rpx solid #fc0;
								background: #ffeda2;
							}

							&.active {
								border: 2rpx solid #fc0;
								background: #ffeda2;
							}

						}
					}
				}

			}

			.btnBox {
				border-radius: 20rpx;
				overflow: hidden;
				position: fixed;
				bottom: 20rpx;
				left: 20rpx;
				right: 20rpx;
				background-color: #ee1834;
				width: 50%;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				font-size: 30rpx;
				color: #fff;
				text-align: center;
				width: 90%;
				margin: 0 auto;
			}
		}
	}

	.uni-popup {
		z-index: 999;
	}
</style>
