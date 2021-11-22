<template>
	<view>
		<view class="user">
			<view class="left">
				<image :src="getImg" @tap="toSetting"></image>
			</view>
			<view class="right" @tap="toSetting">
				<view class="username">{{userInfo.username}}</view>
				<view class="signature">{{userInfo.email}}
					<text class="yanzhen" v-if="userInfo.status == 0"> 待验证</text>
				</view>
			</view>
		</view>
		<view class="order">
			<view class="header" @tap="toOrderList(-1)">
				<view class="title">我的订单</view>
				<view class="more">全部订单
					<uni-icons type="arrowright" size="16"></uni-icons>
				</view>
			</view>
			<!-- 订单类型 -->
			<view class="list">
				<view class="box" v-for="(row,index) in orderList" :key="index" @tap="toOrderList(index)">
					<view class="img">
						<image :src="row.img" mode="widthFix" class="imgitem"></image>
					</view>
					<view class="text">{{row.text}}</view>
				</view>
			</view>
		</view>
		<!-- 工具栏 -->
		<view class="toolbar">
			<view class="title">更多工具</view>
			<view class="list">
				<view class="box" v-for="(row,index) in mytoolbarList" :key="index" @tap="toPage(row.url)">
					<view class="img">
						<image :src="row.img"></image>
					</view>
					<view class="text">{{row.text}}</view>
				</view>
			</view>
		</view>

		<!-- 商品列表 -->
		<goodsList :title="title" :productList="productList" :loadingText="loadtext"></goodsList>
		<!-- 占位 -->
		<view class="place-bottom"></view>
	</view>
</template>
<script>
	import goodsList from '@/components/home/goods-list.vue'
	import {
		mapMutations,
		mapState
	} from 'vuex'
	export default {
		components: {
			goodsList
		},
		data() {
			return {
				title: "专属推荐",
				loadtext: "上拉加载更多",
				tabId: 0,
				page: 1,
				total: 0,
				productList: [],
				isfirst: true,
				orderList: [{
						text: '待付款',
						img: "/static/img/user/fukuan.png"
					},
					{
						text: '待收货',
						img: "/static/img/user/shouhuo.png"
					},
					{
						text: '待评价',
						img: "/static/img/user/pingjia.png"
					},
					{
						text: '退换货',
						img: "/static/img/user/tuihuo.png"
					}
				],
				// 工具栏列表
				mytoolbarList: [{
						url: '../../user/setting/setting',
						text: '我的设置',
						img: '/static/img/user/pingjia.png'
					},
					{
						url: '../../user/address/address?title=地址管理',
						text: '地址管理',
						img: '/static/img/user/addr.png'
					},
					{
						url: '../../user/keep/keep',
						text: '我的收藏',
						img: '/static/img/user/point.png'
					},

					{
						url: '../../user/passwd/passwd',
						text: '修改密码',
						img: '/static/img/user/security.png'
					},
					{
						url: 'logout',
						text: '退出登录',
						img: '/static/img/user/choujiang.png'
					},
					// {text:'客服',img:'/static/img/user/kefu.png'},
					// {text:'签到',img:'/static/img/user/mingxi.png'}
				],

			}
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			this.getProductList()
			uni.stopPullDownRefresh()
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			uni.showToast({
				title: '触发上拉加载'
			});
			if (this.loadtext !== '上拉加载更多') return;
			this.loadtext = '加载中...'
			this.page++
			this.getProductList(false)
		},
		onLoad() {
			this.getProductList()
		},
		computed: {
			...mapState({
				loginStatus: state => state.user.loginStatus,
				userInfo: state => state.user.userInfo
			}),

			getImg() {
				if (this.userInfo.wechat_openid == null) {
					return this.userInfo.face
				}
				return this.userInfo.wechat_headimgurl
			}
		},
		methods: {
			...mapMutations(['logout']),
						
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
			toOrderList(index) {
				uni.setStorageSync('tbIndex', index);
				uni.navigateTo({
					url: '../../user/order_list/order_list?tbIndex=' + index
				})
			},
			toSetting() {
				uni.navigateTo({
					url: '../../user/setting/setting'
				})
			},

			toDeposit() {
				uni.navigateTo({
					url: '../../user/deposit/deposit'
				})
			},
			toPage(url) {
				if (url == 'logout') {
					this.logout()
					uni.navigateTo({
						url: '/pages/login/login'
					});
				}
				if (!url) {
					uni.showToast({
						title: '模板未包含此页面',
						icon: "none"
					});
					return;
				}
				uni.navigateTo({
					url: url,
				})
			},
		}
	}
</script>
<style lang="scss">
	page {
		position: relative;
		background-color: #fff;
	}

	.place-bottom {
		height: 20upx;
	}

	.user {
		width: 92%;
		padding: 40upx 4%;
		display: flex;
		align-items: center;
		// position: relative;
		background-color: #91683e;
		padding-bottom: 120upx;
		border-radius: 0 0 30upx 30upx;

		.left {
			width: 20vw;
			height: 20vw;
			flex-shrink: 0;
			margin-right: 20upx;
			border: solid 1upx #fff;
			border-radius: 100%;

			image {
				width: 20vw;
				height: 20vw;
				border-radius: 100%;
			}

		}

		.right {
			width: 100%;

			.username {
				font-size: 36upx;
				color: #fff;
			}

			.signature {
				color: #eee;
				font-size: 28upx;
			}

			.yanzhen {
				padding: 2upx 10upx;
				margin-left: 10upx;
				background-color: #d85f61;
				color: #fff;
				font-size: 20upx;
				border-radius: 5upx;
			}
		}

	}

	.order {
		width: 84%;
		margin: 30upx 4% 30upx 4%;
		margin-top: -100upx;
		padding: 20upx 4% 20upx 4%;
		background-color: #fff;
		box-shadow: 0upx 0upx 25upx rgba(0, 0, 0, 0.1);
		border-radius: 15upx;

		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-bottom: 20upx;
			border-bottom: 1upx solid #eee;

			.title {
				font-size: 32upx;
			}

			.more {
				font-size: 26upx;
				color: #444;
				display: flex;
				align-items: center;
			}
		}

		.list {
			display: flex;
			padding: 15upx 0;
			.box {
				width: 25%;
				.img {
					width: 100%;
					display: flex;
					justify-content: center;
					padding: 10upx 0;
					.imgitem {
						width: 60upx;
					}
				}

				.text {
					width: 100%;
					display: flex;
					justify-content: center;
					font-size: 28upx;
					color: #3d3d3d;
				}
			}
		}
	}

	.toolbar {
		width: 92%;
		margin: 0 4% 0 4%;
		padding: 0 0 20upx 0;
		background-color: #fff;
		box-shadow: 0upx 0upx 25upx rgba(0, 0, 0, 0.1);
		border-radius: 15upx;

		.title {
			padding-top: 10upx;
			margin: 0 0 10upx 3%;
			font-size: 30upx;
			height: 80upx;
			display: flex;
			align-items: center;
		}

		.list {
			display: flex;
			flex-wrap: wrap;

			.box {
				width: 25%;
				margin-bottom: 30upx;

				.img {
					width: 23vw;
					height: 10.5vw;
					display: flex;
					justify-content: center;

					image {
						width: 9vw;
						height: 9vw;
					}
				}

				.text {
					width: 100%;
					display: flex;
					justify-content: center;
					font-size: 26upx;
					color: #3d3d3d;
				}
			}
		}
	}
</style>
