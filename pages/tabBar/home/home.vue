<template>
	<view>
		<seatchInput :headerPosition="headerPosition"/>								
		<!-- 轮播图 -->
		<swiperImg :swiperList="home.swiper"/>
		<!-- 分类列表 -->
		<tab1List :tab1List="home.tab1"/>
		<!-- 广告图 -->
		<threeAdv :bigImg ="bigImg" :smImg1="smImg1" :smImg2="smImg2"/>
		<divider/>
		<!-- 商品列表 -->
		<view class="goods-list">
			<!-- tab列表 -->
			<scroll-view scroll-with-animation scroll-x class="topTabBar" :class="tabPosition ? 'fixed' : ''" @scroll="scrollMove" :scroll-left="scrollLeft">
				<view class="innerBox">
					<view class="grid" :class="[tbIndex == tabbarIndex ? 'on' : '']" v-for="(item, tbIndex) in home.tab2" :key="tbIndex" :id="'ele' + tbIndex" @tap="showType(tbIndex)">
						<view class="text">{{ item.name }}</view>
						<view class="cont">{{ item.desc }}</view>
					</view>
				</view>
			</scroll-view>
			
			<goodsList :productList="productList" :loadingText="loadtext"/>

		</view>
		
	</view>
</template>

<script>
import seatchInput from '@/components/home/seatch_input.vue'	
import swiperImg from '@/components/home/swiper-img.vue'
import tab1List from '@/components/home/tab1-list.vue'
import threeAdv from '@/components/home/three-adv.vue'
import goodsList from '@/components/home/goods-list.vue'

var ttt = 0;
export default {
	components: {
		seatchInput,swiperImg,tab1List,threeAdv,goodsList
	},
	data() {
		return {
			home:[],
			bigImg:'',
			smImg1:'',
			smImg2:'',
			loadtext: "上拉加载更多",
			tabId: 0,
			page: 1,
			total: 0,
			productList: [],
			showHeader: true,
			afterHeaderOpacity: 1, //不透明度
			headerPosition: 'fixed',
			headerTop: null,
			statusTop: null,			
			tabHeight: '',
			tabPosition: '',
			scrollLeft: '',
			moveParams: {
				scrollLeft: 0, // scroll-view滚动的距离,默认为0,因为没有触发滚动
				subLeft: '', //点击元素距离屏幕左边的距离
				subHalfWidth: '', //点击元素的宽度一半
				screenHalfWidth: '' //屏幕宽度的一半
			},		
			tabbarIndex: 0,	
		};
	},
	onPageScroll(e) {
		//兼容iOS端下拉时顶部漂移
		this.headerPosition = e.scrollTop >= 0 ? 'fixed' : 'absolute';
		this.headerTop = e.scrollTop >= 0 ? null : 0;
		this.statusTop = e.scrollTop >= 0 ? null : -this.statusHeight + 'px';
		// 判断tab分类位置
		this.tabPosition = e.scrollTop >= this.tabHeight - 50 ? true : false;
	},
	//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
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
		uni.setNavigationBarTitle({title: 'WLS 商城'});
		this.getHomeList()
		this.getProductList()
		// #ifdef APP-PLUS
		this.showHeader = false;
		this.statusHeight = plus.navigator.getStatusbarHeight();
		// #endif

	},
	onReady() {
		// 获取tab距顶部高度
		this.getTabHeight();
		// 获取屏幕宽度
		this.getScreenWidth();
	},
	methods: {
		getHomeList() {
			this.$H.get(this.$A.m().home).then(res => {
				this.home = res	
				res.banner.forEach(item=>{
					if(item.name =='big'){						
						this.bigImg = item.img
					}else if(item.name == 'sm1'){
						this.smImg1 = item.img
					}else if(item.name == 'sm2'){
						this.smImg2 = item.img
					}
				})																																													
			})
		},

		// 加载数据
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
			
		getTabHeight() {
			var that = this;
			uni
				.createSelectorQuery()
				.select('.topTabBar')
				.boundingClientRect(function(e) {
					that.tabHeight = e.top;
				})
				.exec();
		},
		getScreenWidth() {
			var that = this;
			uni.getSystemInfo({
				success(res) {
					let moveParams = that.moveParams;
					moveParams.screenHalfWidth = res.screenWidth / 2;
				}
			});
		},
		getRect(ele) {
			//获取点击元素的信息,ele为传入的id
			var that = this;
			uni
				.createSelectorQuery()
				.select(ele)
				.boundingClientRect(function(rect) {
					let moveParams = that.moveParams;
					moveParams.subLeft = rect.left;
					moveParams.subHalfWidth = rect.width / 2;
					that.moveTo();
				})
				.exec();
		},
		scrollMove(e) {
			let moveParams = this.moveParams;
			moveParams.scrollLeft = e.detail.scrollLeft;
			this.moveParams = moveParams;
		},
		moveTo() {
			let subLeft = this.moveParams.subLeft;
			let screenHalfWidth = this.moveParams.screenHalfWidth;
			let subHalfWidth = this.moveParams.subHalfWidth;
			let scrollLeft = this.moveParams.scrollLeft;
			let distance = subLeft - screenHalfWidth + subHalfWidth;
			scrollLeft = scrollLeft + distance;
			this.scrollLeft = scrollLeft;
		},
		// tab切换
		showType(tbIndex) {
			this.tabbarIndex = tbIndex;
			let ele = 'ele' + tbIndex;
			this.getRect('#' + ele);
			// this.list = this.orderList[tbIndex];
		}
	}
};
</script>
<style lang="scss">
page {
	position: relative;
	background-color: #fff;
}

@font-face {
	font-family: 'HMfont-home';
	src: url('data:application/x-font-woff2;charset=utf-8;base64,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')
		format('woff2');
}

.pullDown-effects {
	position: fixed;
	//top: calc(100upx - 36vw);
	top: 0;
	z-index: 9;
	width: 100%;
	height: 36vw;
	/*  #ifdef  APP-PLUS  */
	padding-top: var(--status-bar-height);
	/*  #endif  */
	image {
		width: 100%;
		height: 36vw;
	}
}
.goods-list {
	// background-color: #f4f4f4;
	margin-top: 20upx;
	.topTabBar {
		width: 95%;
		margin: 0upx auto;
		background-color: #fff;
		height: 100upx;
		display: flex;
		overflow: auto;

		&.fixed {
			position: fixed;
			top: 100upx;
			z-index: 10;
			width: 100%;
		}
		.innerBox {
			display: flex;
			.grid {
				flex: 1;
				min-width: 20%;
				height: 90upx;
				font-size: 28upx;
				text-align: center;
				flex-shrink: 0;
				transition: all 0.2s ease;
				.text {
					height: 50upx;
					line-height: 50upx;
				}
				.cont {
					color: #444;
					font-size: 24upx;
				}
				&.on {
					font-size: 36upx;
					color: #e91a28;
					border-bottom: solid 4upx #e91a28;
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
}
</style>



