<template>
	<view>
		<view class="list">
			<!-- 优惠券列表 -->
			<view class="sub-list goods">
				<view class="tis" v-if="keepList.length == 0">没有数据~</view>
				<view class="row" v-for="(row, index) in keepList" :key="index">
					<!-- 删除按钮 -->
					<view class="menu" @tap.stop="deleteCoupon(row.id, goodsList)"><view class="icon shanchu"></view></view>
					<!-- content -->
					<view
						class="carrier"
						:class="theIndex == index ? 'open' : oldIndex == index ? 'close' : ''"
						@touchstart="touchStart(index, $event)"
						@touchmove="touchMove(index, $event)"
						@touchend="touchEnd(index, $event)"
					>								
						<view class="goods-info" @tap="toGoods(row)">
							<view class="img"><image :src="row.img"></image></view>
							<view class="info">
								<view class="title">{{ row.goods.name }}</view>
								<view class="title">{{ row.goods.desc }}</view>
								<view class="tags" :class="item.desc == 'red' ? 'red' : item.desc == 'yellow' ? 'yellow' : 'green'" v-for="(item, index) in row.tags" :key="index">
									{{ item.name }}
								</view>
								<view class="price-number">
									<view class="price">{{ row.price }}</view>
								</view>
							</view>
						</view>																			
					</view>
				</view>
			</view>
		</view>
		
		
		
	<goodsList :title="title" :productList="productList" :loadingText="loadtext"></goodsList>			
	</view>
</template>

<script>
import goodsList from '@/components/home/goods-list.vue'	
export default {
	components: {
			goodsList
	},
	data() {
		return {
			keepList: [],
			headerTop: 0,
			//控制滑动效果
			subState: '',
			theIndex: null,
			oldIndex: null,
			isStop: false,
			//猜你喜欢列表
			title:"为你推荐",
			loadtext: "上拉加载更多",
			tabId: 0,
			page: 1,
			total: 0,
			productList: [],
		};
	},
	onPullDownRefresh() {
			this.getProductList()
			uni.stopPullDownRefresh()
	},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
	onReachBottom() {
			uni.showToast({title: '触发上拉加载'});
			if (this.loadtext !== '上拉加载更多') return;
			this.loadtext = '加载中...'
			this.page++
			this.getProductList(false)
	},
	onLoad() {
		this.getKeepList()	
		this.getProductList()		
	},
	
	methods: {
		
		getKeepList(){
			this.$H.get(this.$A.m().keepGoods,{},{token:true}).then(res=>{
				this.keepList = res										
			})	
		},
		
		getProductList(refresh = true, callback = false) {
			let page = refresh ? 1 : this.page
			this.$H.get(this.$A.m().productList, {page: page,
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
		
		
		//控制左滑删除效果-begin
		touchStart(index, event) {
			//多点触控不触发
			if (event.touches.length > 1) {
				this.isStop = true;
				return;
			}
			this.oldIndex = this.theIndex;
			this.theIndex = null;
			//初始坐标
			this.initXY = [event.touches[0].pageX, event.touches[0].pageY];
		},
		touchMove(index, event) {
			//多点触控不触发
			if (event.touches.length > 1) {
				this.isStop = true;
				return;
			}
			let moveX = event.touches[0].pageX - this.initXY[0];
			let moveY = event.touches[0].pageY - this.initXY[1];

			if (this.isStop || Math.abs(moveX) < 5) {
				return;
			}
			if (Math.abs(moveY) > Math.abs(moveX)) {
				// 竖向滑动-不触发左滑效果
				this.isStop = true;
				return;
			}

			if (moveX < 0) {
				this.theIndex = index;
				this.isStop = true;
			} else if (moveX > 0) {
				if (this.theIndex != null && this.oldIndex == this.theIndex) {
					this.oldIndex = index;
					this.theIndex = null;
					this.isStop = true;
					setTimeout(() => {
						this.oldIndex = null;
					}, 150);
				}
			}
		},

		touchEnd(index, $event) {
			//解除禁止触发状态
			this.isStop = false;
		},

		//删除商品
		deleteCoupon(id, List) {
			let len = List.length;
			for (let i = 0; i < len; i++) {
				if (id == List[i].id) {
					List.splice(i, 1);
					break;
				}
			}
			this.oldIndex = null;
			this.theIndex = null;
		},

		discard() {
			//丢弃
		},
		//商品跳转
		toGoods(e) {			
			uni.navigateTo({url: '../../goods/goods'});
		}
	}
};
</script>
<style lang="scss">
view {
	display: flex;
	flex-wrap: wrap;
}
page {
	position: relative;
	background-color: #f5f5f5;
}

.hidden {
	display: none !important;
}
.tabr {
	background-color: #fff;
	width: 94%;
	height: 95upx;
	padding: 0 3%;
	border-bottom: solid 1upx #dedede;
	position: fixed;
	top: 0;
	z-index: 10;
	view {
		width: 50%;
		height: 90upx;
		justify-content: center;
		align-items: center;
		font-size: 32upx;
		color: #999;
	}
	.on {
		color: #f06c7a;
	}
	.border {
		height: 4upx;
		background-color: #f06c7a;
		transition: all 0.3s ease-out;
		&.shop {
			transform: translate3d(100%, 0, 0);
		}
	}
}
.list {
	width: 100%;
	display: block;
	position: relative;
}
@keyframes showGoods {
	0% {
		transform: translateX(-100%);
	}
	100% {
		transform: translateX(0);
	}
}
@keyframes showShop {
	0% {
		transform: translateX(0);
	}
	100% {
		transform: translateX(-100%);
	}
}
.sub-list {
	&.shop {
		position: absolute;
		top: 0;
		left: 100%;
		display: none;
	}
	&.showgoods {
		display: flex;
		animation: showGoods 0.2s linear both;
	}
	&.showshop {
		display: flex;
		animation: showShop 0.2s linear both;
	}
	width: 100%;
	padding: 20upx 0 40upx 0;
	.tis {
		width: 100%;
		height: 60upx;
		justify-content: center;
		align-items: center;
		font-size: 32upx;
	}
	&.shop {
		.row {
			height: 20vw;
			.left {
				width: 20vw;
				height: 20vw;
				padding-left: 20upx;
				align-items: center;
				image {
					width: 18vw;
					height: 18vw;
					border-radius: 100%;
				}
			}
			.right {
				height: 20vw;
				align-items: center;
				font-size: 32upx;
			}
		}
	}
	.row {
		width: 100%;
		height: 30vw;
		align-items: center;
		position: relative;
		overflow: hidden;
		border-bottom: solid 1upx #dedede;
		.menu {
			.icon {
				color: #fff;
				font-size: 50upx;
			}
			position: absolute;
			width: 28%;
			height: 100%;
			right: 0;
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
					transform: translateX(-28%);
				}
			}
			@keyframes closeMenu {
				0% {
					transform: translateX(-28%);
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

			position: absolute;
			width: 100%;
			padding: 0 0;
			height: 100%;
			z-index: 3;
			flex-wrap: nowrap;
			.goods-info {
				width: calc(100% - 40upx);
				padding: 20upx;
				flex-wrap: nowrap;
				.img {
					width: calc(30vw - 40upx);
					height: calc(30vw - 40upx);
					border-radius: 10upx;
					overflow: hidden;
					flex-shrink: 0;
					margin-right: 20upx;
					image {
						width: calc(30vw - 40upx);
						height: calc(30vw - 40upx);
					}
				}
				.info {
					width: 100%;
					height: calc(30vw - 40upx);
					overflow: hidden;
					flex-wrap: wrap;
					align-content: space-between;
					position: relative;
					.title {
						width: 100%;
						font-size: 28upx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
					.tags {
						padding: 2upx 10upx;
						font-size: 24upx;
						margin-right: 10upx;
						border-radius: 5upx;
						color: #fff;
						display: inline-block;
						&.red {
							background-color: #d85f61;
						}
						&.yellow {
							background-color: #ffcc4a;
						}
						&.green {
							background-color: #6fd85f;
						}
					}

					.price-number {
						width: 100%;
						justify-content: space-between;
						align-items: baseline;

						.price {
							font-size: 34upx;
							color: #f0393c;
						}
					}
				}
			}
		}
	}
}
.product-title {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 60upx;
	color: #0a0a0a;
	font-size: 34upx;
}
.product-list {
	margin-top: 20upx;
	width: 92%;
	padding: 0 4% 3vw 4%;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	.product {
		width: 48%;
		border-radius: 20upx;
		background-color: #fff;
		margin: 0 0 15upx 0;
		box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.1);
		.imgBox {
			position: relative;
			width: 100%;
			image {
				width: 100%;
				border-radius: 20upx 20upx 0 0;
			}
			.tagBox {
				position: absolute;
				left: 2upx;
				bottom: 10upx;
				width: 100%;
				.tags {
					padding: 2upx 10upx;
					font-size: 24upx;
					margin-right: 10upx;
					border-radius: 5upx;
					color: #fff;
					display: inline-block;
					&.red {
						background-color: #d85f61;
					}
					&.yellow {
						background-color: #ffcc4a;
					}
					&.green {
						background-color: #6fd85f;
					}
				}
			}
		}

		.name {
			width: 92%;
			padding: 10upx 4%;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			text-align: justify;
			overflow: hidden;
			font-size: 30upx;
		}
		.info {
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			width: 92%;
			padding: 10upx 4% 10upx 4%;

			.price {
				color: #e65339;
				font-size: 30upx;
				font-weight: 600;
			}
			.slogan {
				color: #807c87;
				font-size: 24upx;
			}
		}
	}
}

	.loading-text {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60upx;
		color: #979797;
		font-size: 24upx;
	}
</style>
