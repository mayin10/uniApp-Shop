<template>
	<view>
		<view v-if="title != null" class="product-title">{{title}}</view>
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
			productList: Array,			
			title:{
				type:String,
				default:null
			}
		},		
		methods: {			
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
		z-index: 10;
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

