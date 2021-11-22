<template>
	<view>
		<seatchInput :headerPosition="headerPosition"/>
		<view class="category-list">				
			<scroll-view scroll-y="true" class="left" >
				<view class="row" v-for="(category, index) in categoryList" :key="category.id" :class="[index == showCategoryIndex ? 'on' : '']" @tap="showCategory(index)">
					<view class="text">
						<view class="currentItem">{{ category.name }}</view>
					</view>
				</view>
			</scroll-view>
			
			<scroll-view scroll-y="true" class="right">
				<view class="category" v-for="(category, index) in categoryList" :key="category.id" v-show="index == showCategoryIndex">
					<view class="banner"><image :src="category.img"></image></view>
					<view class="list">
						<view class="box" v-for="(goods, index2) in category.goods" :key="index2" @tap="toGoods(goods)">
							<image :src="goods.img"></image>
							<view class="text">{{ goods.keywords }}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>
<script>
import seatchInput from '@/components/home/seatch_input.vue'	
export default {
	components: {
		seatchInput
	},
	data() {
		return {
			showCategoryIndex: 0,
			headerPosition: 'fixed',	
			categoryList: []
		};
	},
	
	onLoad() {
		this.getCateList()
	},
	onPageScroll(e) {		
		if (e.scrollTop >= 0) {
			this.headerPosition = 'fixed';
		} else {
			this.headerPosition = 'absolute';
		}
	},

	methods: {
		getCateList() {
			this.$H.get(this.$A.m().category).then(res => {
				this.categoryList = res	
			})
		},
		showCategory(index) {
			this.showCategoryIndex = index;
		},
		
		toGoods(goods) {				
			uni.navigateTo({url: '../../goods/goods?goods_id=' + goods.id});
		},
	}
};
</script>
<style lang="scss">

.category-list {
	width: 100%;
	background-color: #fff;
	display: flex;
	.left,
	.right {
		position: absolute;
		top: 100upx;
		/*  #ifdef  APP-PLUS  */
		top: calc(100upx + var(--status-bar-height));
		/*  #endif  */
		bottom: 0upx;
	}
	.left {
		width: 24%;
		left: 0upx;
		background-color: #f2f2f2;
		.row {
			width: 100%;
			height: 90upx;
			display: flex;
			align-items: center;
			.text {
				width: 100%;
				position: relative;
				font-size: 28upx;
				display: flex;
				justify-content: center;
				color: #3c3c3c;
				.block {
					position: absolute;
					width: 0upx;
					left: 0;
				}
			}
			&.on {
				height: 100upx;
				background-color: #fff;
				.text {
					font-size: 30upx;
					// font-weight: 600;
					color: #2d2d2d;
					.currentItem {
						width: 86%;
						padding: 5upx 10upx;
						text-align: center;
						height: 98%;
						box-sizing: border-box;
						border-radius: 20px;
						color: #fff;
						background: linear-gradient(to right,#df5c43,#ce3325);
					}
				}
			}
		}
	}
	.right {
		width: 76%;
		left: 24%;
		.category {
			width: 94%;
			padding: 20upx 3%;
			.banner {
				width: 100%;
				height: 24.262vw;
				border-radius: 10upx;
				overflow: hidden;
				box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.3);
				image {
					width: 100%;
					height: 24.262vw;
				}
			}
			.list {
				margin-top: 40upx;
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				.box {
					width: calc(71.44vw / 3);
					margin-bottom: 30upx;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-wrap: wrap;
					image {
						width: 60%;
						height: calc(71.44vw / 3 * 0.6);
					}
					.text {
						margin-top: 5upx;
						width: 100%;
						display: flex;
						justify-content: center;
						font-size: 26upx;
					}
				}
			}
		}
	}
}
</style>
