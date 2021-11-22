<template>
	<view>
		<view class="product-title">{{title}}</view>
		<view class="product-list">
		<view class="product" v-for="product in productList" :key="product.goods_id" @tap="toGoods(product)">
			<view class="imgBox">
				<image :src="product.img" lazy-load></image>
				<view class="tagBox">
					<view class="tags" :class="item.desc" v-for="(item, index) in product.tags" :key="index">
						{{ item.name}}
					</view>
				</view>
			</view>
			<view class="name">{{ product.name }}</view>
			<view class="info">
				<view class="price">{{ product.price }}</view>
				<view class="slogan">{{ product.slogan }}</view>
			</view>
		</view>				
	</view>

	</view>
</template>

<script>
	export default {
		props: {			
			title:String
		},	
		data() {
			return {
				loadtext: "上拉加载更多",
				tabId: 0,
				page: 1,
				total: 0,
				productList: [],
	
			};
		},	
		onLoad() {
			this.getProductList()
		},
		onPullDownRefresh() {
			this.getProductList()
			uni.stopPullDownRefresh()
		},
		onReachBottom() {
			uni.showToast({title: '触发上拉加载'});
			if (this.loadtext !== '上拉加载更多') return;
			this.loadtext = '加载中...'
			this.page++
			this.getProductList(false)
		},
		
		methods: {
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
			
			toGoods(e) {				
				uni.navigateTo({url: '../../goods/goods?goods_id=' + e.goods_id});
			},
		},
		
		
	}
</script>

<style lang="scss">
	
	.exclusive {
		padding: 20upx;
		padding-left: 30upx;
		padding-bottom: 0;
		font-size: 34upx;
	}
	.product-title {
		padding: 20upx;
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
			width: 46%;
			border-radius: 20upx;
			background-color: #fff;
			margin: 0 0 15upx 0;
			box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.1);
			.imgBox {
				position: relative;
				image {
					width: 100%;
					height: 45vw;
					border-radius: 20upx 20upx 0 0;
				}
				.tagBox {
					position: absolute;
					left: 2upx;
					bottom: 20upx;
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
</style>
