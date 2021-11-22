<template>
	<view>
		<view class="status" :style="{ opacity: afterHeaderOpacity }"/>		
		<view class="header">
			<!-- 头部-默认显示 -->
			<view class="before" :style="{ opacity: 1 - afterHeaderOpacity, zIndex: beforeHeaderzIndex }">
				<view class="back"><view class="icon xiangqian" @tap="toHome" v-if="showBack"></view></view>
				<view class="middle"></view>
				<view class="icon-btn"> </view>												
			</view>
			<!-- 头部-滚动渐变显示 -->
			<view class="after" :style="{ opacity: afterHeaderOpacity, zIndex: afterHeaderzIndex }">
				<view class="back"><view class="icon xiangqian" @tap="toHome" v-if="showBack"></view></view>
				<view class="middle">
					<view v-for="(anchor, index) in anchorlist" :class="[selectAnchor == index ? 'on' : '']" :key="index" @tap="toAnchor(index)">{{ anchor.name }}</view>
				</view>
				<view > </view>														
			</view>
		</view>
		<!-- 底部菜单 -->
		<view class="footer">
			<view class="icons">
				<view class="box" @tap="toHome">
					<uni-icons type="home"  size="25" />				
				</view>
				<view class="box" @tap="toCart">					
					<uni-icons type="cart"  size="25" />					
				</view>
			</view>
			<view class="btn">
				<view class="joinCart" @tap="joinCartFooter">加入购物车</view>
				<view class="buy" @tap="buyFooter">立即购买</view>
			</view>
		</view>
		

		<!-- 服务-模态层弹窗 -->
		<view class="popup service" :class="serviceClass" @touchmove.stop.prevent="discard" @tap="hideService">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer" @tap.stop="discard">
				<view class="content">
					<view class="row" v-for="(item, index) in service" :key="index">
						<view class="title">
							<uni-icons type="checkbox" size="16" color="#dc2436" class="iconBox"></uni-icons>
							{{ item.name }}
						</view>
						<view class="description">{{ item.desc }}</view>
					</view>
				</view>
				<view class="btn"><view class="button" @tap="hideService">完成</view></view>
			</view>
		</view>
		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="discard" @tap="hideSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer" @tap.stop="discard">
				<view class="config">
					<view class="a-t">
						<image :src="showImg"></image>
						<view class="right">
							<text class="price">€ {{showPreis}}</text>
							<view class="selected">
								<text class="selected-text" >{{ showSkuText }}</text>
							</view>
							<view class="selected">
								<text class="selected-text" >运输方式:{{ checkedDeliveryText }}</text>
							</view>
						</view>
					</view>
					<view class="configList">					
						
						<view v-for="(item, index) in skuCard" :key="index" class="attr-list">
								<text>{{ item.name }}</text>
									<view class="item-list">
										<text v-for="(childItem, childIndex) in item.value"	:key="childIndex"
												class="tit" :class="getClass(childItem)" @click="selectSkus(index,childIndex )" disabled>								
												{{ childItem.val }}
									</text>
								</view>
						</view>
												
						<view class="attr-list" v-if="checkedSkus != null">
							<text>运输方式</text>
							<view class="item-list">
								<text v-for="(dd, ddindex) in checkedSkus.delivery"	:key="ddindex" 
									class="tit"  :class="dd.selected?'selected':''" @click="selectDelivery(dd.id, checkedSkus.delivery)">								
									 {{ dd.delivery_type_label}}- {{ dd.preis}}
							 </text>
							 </view>
						</view>																																																																	
					</view>
					<view class="length">
						<view class="text">数量</view>
						<view class="number">
							<view class="sub" @tap.stop="sub"><view class="icon jian"></view></view>
							<view class="input" ><input type="number" v-model="number"  :disabled="true"/></view>
							<view class="add" @tap.stop="add"><view class="icon jia"></view></view>
						</view>
					</view>
					<view class="btn">
						<view class="joinCart" @tap="innerjoinCart">加入购物车</view>
						<view class="buy" @tap="buy">立即购买</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 商品主图轮播 -->
		<view class="swiper-box">
			<swiper circular="true" autoplay="true" @change="swiperChange">
				<swiper-item v-for="swiper in lunbo" :key="swiper.id"><image :src="swiper.img_big"></image></swiper-item>
			</swiper>
			<view class="indicator">{{ currentSwiper + 1 }}/{{ lunbo.length }}</view>
		</view>
		<!-- 标题 价格 -->
		<view class="info-box goods-info">
			<view class="titleBox">
				<view class="price">€{{showPreis}}</view>
				<view class="box" @tap="updateKeep">
					<view class="icon" :class="[isKeep ? 'shoucangsel' : 'shoucang']"></view>
					<view class="text">{{ isKeep ? '已' : '' }}收藏</view>
				</view>
			</view>
			<view class="title">{{ detail.name }}</view>
			<view class="cont">{{ detail.desc }}</view>
		</view>
		<!-- 服务-规则选择 -->
		<view class="info-box spec">
			<view class="row" @tap="showSpec(false)">
				<view class="text">规格</view>
				<view class="content"><view>{{showSkuText}}</view></view>
				<view class="arrow"><view class="icon xiangyou"></view></view>
			</view>
			<view class="row" @tap="showSpec(false)">
				<view class="text">运输方式</view>
				<view class="content"> {{checkedDeliveryText}}</view>
				<view class="arrow"><view class="icon xiangyou"></view></view>
			</view>
			<view class="row" @tap="showService">
				<view class="text">服务</view>
				<view class="content">
					<view class="serviceitem" v-for="(item, index) in service" :key="index">
						<uni-icons type="checkbox" size="16" color="#dc2436" class="iconBox"></uni-icons>
						{{ item.name }}
					</view>
				</view>
				<view class="arrow"><view class="icon xiangyou"></view></view>
			</view>
		</view>
		<!-- 评价 -->
		<view class="info-box comments" id="comments">
			<view class="row">
				<view class="text">商品评价({{ goodsData.comment.number }})</view>
				<view class="arrow" @tap="toRatings">
					<view class="show" @tap="showComments(goodsData.id)">
						查看全部 <view class="icon xiangyou"></view>						
					</view>
				</view>
			</view>
			<view class="comment" @tap="toRatings">
				<view class="user-info">
					<view class="face"><image :src="goodsData.comment.userface"></image></view>
					<view class="username">{{ goodsData.comment.username }}</view>
					<uni-rate :value="goodsData.comment.star" size="12" disabled="true" class="star"></uni-rate>
				</view>
				<view class="content">{{ goodsData.comment.content }}</view>
			</view>
		</view>
		<!-- 详情 -->
		<view class="description">
			<view class="title">———— 商品详情 ————</view>
			<view class="content"><rich-text :nodes="descriptionStr"></rich-text></view>
		</view>
	</view>
</template>

<script>
import uniRate from '@/components/uni-rate/uni-rate.vue'
import card from "@/components/common/card.vue"
import {mapMutations,mapState} from 'vuex'
export default {
	components: {uniRate,card},
	data() {
		return {
			//控制渐变标题栏的参数
			beforeHeaderzIndex: 11, //层级
			afterHeaderzIndex: 10, //层级
			beforeHeaderOpacity: 1, //不透明度
			afterHeaderOpacity: 0, //不透明度
			//是否显示返回按钮
			// #ifndef MP
			showBack: true,
			// #endif
			
			goods_id: 13,
			detail: {},
			lunbo:[],
			service:[],
			skuCard:[],
			goodSkus:[],
			number: 1,
			isKeep: false, 
			descriptionStr:'',
			//轮播图下标
			currentSwiper: 0,
			anchorlist: [], //导航条锚点
			selectAnchor: 0, //选中锚点
			serviceClass: '', //服务弹窗css类，控制开关动画
			specClass: '', //规格弹窗css类，控制开关动画
			shareClass: '', //分享弹窗css类，控制开关动画
			// 商品信息
			goodsData: {
				comment: {
					number: 102,
					userface: '../../static/img/face.jpg',
					username: '雷军',
					star:5,
					content: '很不错，值得购买！'
				}
			},
			
		};
	},
	computed: {
		...mapState({
				userInfo:state=>state.user.userInfo,
				addressList: state => state.cart.addressList,				
		}),
		getSkuText() {
			let txt = []
			this.skuCard.forEach(item1 => {
				item1.value.forEach(item2 => {
					if (item2.selected) {
						txt.push(item2.name_val)
					}
				});
			});
			return txt.join(' ');
		},
						
		specSelected() {
			return this.checkedSkus != null;
		},
		checkedSkus() {
			let sku = null
			this.goodSkus.forEach(item => {
				if (item.specs == this.getSkuText) {
					sku = item;
				}
			})
				return sku;
		},
		checkedDelivery(){
			let delivery = null
			if(this.checkedSkus !=null){
				let deliveryList  = this.checkedSkus.delivery
				deliveryList.forEach(item => {
					if (item.selected) {
						delivery = item
					}
				})
			}
			return delivery
		},
		
		checkedDeliveryText(){
			let t= '请选择运输方式'
			if(this.checkedDelivery != null){
				t = this.checkedDelivery.delivery_type_label
			}
			return t
		},	
					
			
		showImg() {
				let m = "/static/img/goodsInfo/banner01.jpg"
				if (this.checkedSkus != null) {
					return this.checkedSkus.img
				}
				return m
		},
		showPreis() {
				let p = 0
				if (this.goodSkus[0] != null) {
					p = this.goodSkus[0].price_1
				}
				if (this.checkedSkus != null) {
					return this.checkedSkus.price_1
				}
				return p
		},
		showSkuText() {
			let t = '请选择规格'
			if (this.checkedSkus != null) {
				t = this.checkedSkus.specs
			}
				return t
		},
		checkedNumber() {
			let n = 1
			if (this.checkedDelivery != null ) {
				let t = this.checkedDelivery.delivery_type
				if (t ==2){
					n = this.checkedSkus.store_cn
				} else{
					n = this.checkedSkus.store_de
				}				
			}
			return n
		},			
	},	
	onLoad(option) {
		this.goods_id = option.goods_id
		this.getDetail()
		this.getKeep()		
		// #ifdef MP
		//小程序隐藏返回按钮
		this.showBack = false;
		// #endif

	},
	onReady() {
		this.calcAnchor(); //计算锚点高度，页面数据是ajax加载时，请把此行放在数据渲染完成事件中执行以保证高度计算正确
	},
	onPageScroll(e) {
		//锚点切换
		this.selectAnchor = e.scrollTop >= this.anchorlist[2].top ? 2 : e.scrollTop >= this.anchorlist[1].top ? 1 : 0;
		//导航栏渐变
		let tmpY = 375;
		e.scrollTop = e.scrollTop > tmpY ? 375 : e.scrollTop;
		this.afterHeaderOpacity = e.scrollTop * (1 / tmpY);
		this.beforeHeaderOpacity = 1 - this.afterHeaderOpacity;
		//切换层级
		this.beforeHeaderzIndex = e.scrollTop > 0 ? 10 : 11;
		this.afterHeaderzIndex = e.scrollTop > 0 ? 11 : 10;
	},
	//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
	onReachBottom() {},
	mounted() {},
	methods: {
		...mapMutations([
			'addCartList',			
		]),
		getDetail() {
			this.$H.get(this.$A.m().detail + this.goods_id, {}).then(res => {
				this.detail = res
				this.lunbo = res.goods_lunbo
				this.service = res.service
				this.descriptionStr = this.getDetailString(res)
				this.skuCard = res.attr		
				this.goodSkus = res.skus
			})
		},
			
		getDetailString(res){
			let str = ''
			if(res["detail"] != null && res["detail"] != ''){
				 str = res["detail"]
			}														
			if(res["goods_detail"] != null && res["goods_detail"] != ''){				
				res["goods_detail"].forEach(item => {
				 let img = '<img width="100%"  style="display:block" src="'+item.img_big+'"/>'
				 str = str + img;
				});
			}
			str = '<div style="text-align:center;">' + str + '</div>'			
			return str;
		},
					
		getClass(item) {
			if (!item.valid) {
				return 'valid'
			} else {
				if (item.selected) {
					return 'selected'
				}
			}
			return ''
		},
		
		selectSkus(index1, index2) {
			let skuValue = this.skuCard[index1].value[index2]
			if (!skuValue.valid) {
				return;
			}
			this.skuCard[index1].value.forEach(item => {
				this.$set(item, 'selected', false);
			});
			this.$set(skuValue, 'selected', true);
			this.setValid(index1, skuValue)
			if (this.number > this.checkedNumber) {
				this.number = this.checkedNumber;
			}
		},
		setValid(index1, skuValue) {
			let spec = ''
			this.goodSkus.forEach((item, index) => {
				if (item.specs.indexOf(skuValue.name_val) >= 0) {
					spec = spec + ' ' + item.specs;
				}
			});			
			this.skuCard.forEach(item1 => {
				item1.value.forEach(item2 => {
					this.$set(item2, 'valid', true);
				});
			});
			this.skuCard.forEach((item, index) => {
				if (index != index1) {
					item.value.forEach(item2 => {
						if (spec.indexOf(item2.name_val) < 0) {
							this.$set(item2, 'valid', false);
						}
					});
				}
			});
		},
				
		selectDelivery(id,deliveryList){		
			deliveryList.forEach((item, index) => {
					 if(item.id == id){
						 this.$set(item, 'selected', true)
					 } else{
						  this.$set(item, 'selected', false)
					 }
				});			
		},
		
		getKeep() {
			let data = {					
				user_id: this.userInfo.id,					
				goods_id: this.goods_id,
			}
			let token = {token: true}
			this.$H.post(this.$A.m().keep, data, token).then(res => {
					this.isKeep = res
				})			
		},
		
		updateKeep() {
			let data = {					
				user_id: this.userInfo.id,					
				goods_id: this.goods_id,
			}
			let token = {token: true}
			this.$H.post(this.$A.m().updateKeep, data, token).then(res => {
					if(res.is_keep){
						uni.showToast({title: '加入收藏',icon: 'none'});
					}else{
						uni.showToast({title: '移出收藏',icon: 'none'});
					}																	
					this.isKeep = res
				})			
		},
		
		
		toHome() {
			uni.switchTab ({
				url: '/pages/tabBar/home/home'
			});
		},
		
		toCart() {			
			uni.switchTab ({
				url: '/pages/tabBar/cart/cart'
			});
		},
		//轮播图指示器
		swiperChange(event) {this.currentSwiper = event.detail.current},
		
		
		toChat() {
		},
		// 分享
		share() {
			this.shareClass = 'show';
		},
		hideShare() {
			this.shareClass = 'hide';
			setTimeout(() => {
				this.shareClass = 'none';
			}, 150);
		},

		
		//商品评论
		toRatings() {
			uni.navigateTo({
				url: 'ratings/ratings'
			});
		},
		
		// 加入购物车
		joinCartFooter() {
			this.showSpec(false);
		},
		//立即购买
		buyFooter(){
			this.addCart(this.checkedSkus, this.checkedDelivery, true)
		},
		buy() {
			this.hideSpec()
			this.addCart(this.checkedSkus, this.checkedDelivery, true)
		},
		// 加入购物车
		innerjoinCart() {
			if (this.checkedSkus == null) {
				uni.showToast({ title: '请选择规格', icon: 'none' });	
			} else if(this.checkedDelivery == null){
				uni.showToast({ title: '请选择运输方式', icon: 'none' });	
			}else {
				this.addCart(this.checkedSkus, this.checkedDelivery, false)
			}
		},

		addCart(sku, delivery,toConfirm){
			let data = {
				user_id: this.userInfo.user_id,
				sku_id: sku.id,
				sku_delivery_id:delivery.id,
				delivery_type:delivery.delivery_type,
				amount: this.number,
				is_selected: 1
			}			
			let token = {token: true}
			this.$H.post(this.$A.m().addCart, data, token).then(res => {
				setTimeout(() => {
					uni.$emit('updateCart')
				}, 1000);
				
				uni.showToast({title: '已加入购物车',icon: 'none'});
				
				this.hideSpec();	
				 if(toConfirm){			
					if (this.addressList.length == 0) {
						uni.navigateTo({
							url: '../user/address/edit/edit?type=cart'
						})
					} else {
						uni.navigateTo({
							url: '../order/confirmation'
						})
					}
				 }
			})	
		},

		//跳转评论列表
		showComments(goodsid) {},


		//减少数量
		sub() {
			if (this.number <= 1) {return}
				this.number--
		},
		//增加数量
		add() {
			if (this.number <= this.checkedNumber) {
				this.number++;
			}
		},
		//跳转锚点
		toAnchor(index) {
			this.selectAnchor = index;
			uni.pageScrollTo({ scrollTop: this.anchorlist[index].top, duration: 200 });
		},
		//计算锚点高度
		calcAnchor() {
			this.anchorlist = [{ name: '主图', top: 0 }, { name: '评价', top: 0 }, { name: '详情', top: 0 }];
			let commentsView = uni.createSelectorQuery().select('#comments');
			commentsView
				.boundingClientRect(data => {
					let statusbarHeight = 0;
					//APP内还要计算状态栏高度
					// #ifdef APP-PLUS
					statusbarHeight = plus.navigator.getStatusbarHeight();
					// #endif
					let headerHeight = uni.upx2px(100);
					//this.anchorlist[1].top = data.top - headerHeight - statusbarHeight;
					//this.anchorlist[2].top = data.bottom - headerHeight - statusbarHeight;
				})
				.exec();
		},
		//返回上一页
		back() {
			uni.navigateBack();
		},
		//服务弹窗
		showService() {			
			this.serviceClass = 'show';
		},
		//关闭服务弹窗
		hideService() {
			this.serviceClass = 'hide';
			setTimeout(() => {
				this.serviceClass = 'none';
			}, 200);
		},
		//规格弹窗
		showSpec(fun) {			
			this.specClass = 'show';
			this.specCallback = fun;
		},
		specCallback() {
			return;
		},
		//关闭规格弹窗
		hideSpec() {
			this.specClass = 'hide';
			//回调
			this.specSelected && this.specCallback && this.specCallback();
			this.specCallback = false;
			setTimeout(() => {
				this.specClass = 'none';
			}, 200);
		},
		discard() {
			//丢弃
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f8f8f8;
}
@keyframes showPopup {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
@keyframes hidePopup {
	0% {
		opacity: 1;
	}
	100% {
		opacity: 0;
	}
}
@keyframes showLayer {
	0% {
		transform: translateY(0);
	}
	100% {
		transform: translateY(-100%);
	}
}
@keyframes hideLayer {
	0% {
		transform: translateY(-100%);
	}
	100% {
		transform: translateY(0);
	}
}

.icon {
	font-size: 26upx;
}
.status {
	width: 100%;
	height: 0;
	position: fixed;
	z-index: 10;
	top: 0;
	/*  #ifdef  APP-PLUS  */
	height: var(--status-bar-height); //覆盖样式
	/*  #endif  */
	background-color: #f1f1f1;
	transition: opacity 0.05s linear;
}
.header {
	width: 100%;

	height: 100upx;
	display: flex;
	align-items: center;
	position: fixed;
	top: 0;
	z-index: 10;
	/*  #ifdef  APP-PLUS  */
	top: var(--status-bar-height);
	/*  #endif  */
	.before,
	.after {
		width: 92%;
		padding: 0 4%;
		height: 100upx;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */
		transition: opacity 0.05s linear;
		.back {
			width: 125upx;
			height: 60upx;
			flex-shrink: 0;
			.icon {
				margin-left: -10%;
				width: 60upx;
				height: 60upx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 42upx;
			}
		}
		.middle {
			width: 100%;
		}
		.icon-btn {
			width: 60upx;
			height: 60upx;
			flex-shrink: 0;
			display: flex;
			.icon {
				&:first-child {
					margin-right: 5upx;
				}
				width: 60upx;
				height: 60upx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 42upx;
			}
		}
	}
	.before {
		.back {
			.icon {
				color: #fff;
				background-color: rgba(0, 0, 0, 0.2);
				border-radius: 100%;
			}
		}
		.icon-btn {
			.icon {
				color: #fff;
				background-color: rgba(0, 0, 0, 0.2);
				border-radius: 100%;
			}
		}
	}
	.after {
		background-color: #f1f1f1;
		.back {
			.icon {
				color: #666;
			}
		}
		.icon-btn {
			.icon {
				color: #666;
			}
		}
		.middle {
			font-size: 32upx;
			height: 90upx;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 7%;
			view {
				width: (100%/3);
				padding: 10upx 3%;
				margin: 0 3%;
				display: flex;
				justify-content: center;
				align-items: center;
				&.on {
					margin-bottom: -4upx;
					color: #8b6945;
					border-bottom: solid 4upx #8b6945;
				}
			}
		}
	}
}
.swiper-box {
	position: relative;
	width: 100%;
	height: 100vw;
	swiper {
		width: 100%;
		height: 100vw;
		swiper-item {
			image {
				width: 100%;
				height: 100vw;
			}
		}
	}
	.indicator {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 25upx;
		height: 40upx;
		border-radius: 40upx;
		font-size: 22upx;
		position: absolute;
		bottom: 20upx;
		right: 20upx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.2);
	}
}
.info-box {
	width: 92%;
	padding: 20upx 4%;
	background-color: #fff;
	margin-bottom: 20upx;
}

.goods-info {
	.titleBox {
		display: flex;
		align-items: center;
		.price {
			font-size: 46upx;
			font-weight: 600;
			color: #ae0805;
		}
		.box {
			margin-left: auto;
			width: 80upx;
			height: 80upx;
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
			.icon {
				font-size: 40upx;
				color: #828282;
				&.shoucangsel {
					color: #ff1246;
				}
			}
			.text {
				display: flex;
				justify-content: center;
				width: 100%;
				font-size: 22upx;
				color: #666;
			}
		}
	}
	.title {
		font-size: 30upx;
	}
	.cont {
		margin-top: 20upx;
		font-size: 24upx;
		color: #333333;
	}
}
.spec {
	.row {
		width: 100%;
		display: flex;
		align-items: center;
		margin: 0 0 30upx 0;
		.text {
			font-size: 24upx;
			color: #a2a2a2;
			margin-right: 20upx;
			flex-shrink: 0;
		}
		.content {
			font-size: 28upx;
			display: flex;
			flex-wrap: wrap;
			padding-right: 10upx;
			.serviceitem {
				margin-right: 10upx;
				display: flex;
				align-items: center;
				.iconBox {
					margin-top: 5upx;
					margin-right: 5upx;
				}
			}
			.sp {
				width: 100%;
				display: flex;
				align-items: center;
				view {
					margin-right: 10upx;
				}
			}
		}
		.arrow {
			position: absolute;
			right: 4%;
			.icon {
				color: #ccc;
			}
		}
	}
}
.comments {
	display: none;
	.row {
		width: 100%;
		height: 40upx;
		display: flex;
		align-items: center;
		margin: 0 0 30upx 0;
		.text {
			font-size: 30upx;
		}
		.arrow {
			font-size: 28upx;
			position: absolute;
			right: 4%;
			color: #666;
			.show {
				display: flex;
				align-items: center;
				.icon {
					color: #666;
				}
			}
		}
	}
	.comment {
		width: 100%;
		.user-info {
			width: 100%;
			height: 40upx;
			display: flex;
			align-items: center;
			.face {
				width: 40upx;
				height: 40upx;
				margin-right: 8upx;
				image {
					width: 40upx;
					height: 40upx;
					border-radius: 100%;
				}
			}
			.username {
				font-size: 24upx;
				color: #999;
			}
			.star {
				margin-left: auto;
				margin-top: 5upx;
			}
		}
		.content {
			margin-top: 10upx;
			font-size: 26upx;
		}
	}
}
.description {
	.title {
		width: 100%;
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 26upx;
		color: #999;
	}
}
.footer {
	position: fixed;
	bottom: 0upx;
	width: 92%;
	padding: 0 4%;
	height: 99upx;
	border-top: solid 1upx #eee;
	background-color: #fff;
	z-index: 2;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.icons {
		display: flex;
		height: 80upx;
		margin-left: -4%;
		.box {
			width: 80upx;
			height: 80upx;
			display: flex;
			padding-left: 40upx;
			justify-content: center;
			flex-wrap: wrap;
			.icon {
				font-size: 40upx;
				color: #828282;
			}
			.text {
				display: flex;
				justify-content: center;
				width: 100%;
				font-size: 22upx;
				color: #666;
			}
		}
	}
	.btn {
		height: 80upx;
		border-radius: 40upx;
		overflow: hidden;
		display: flex;
		margin-right: -2%;
		.joinCart,
		.buy {
			width: 200upx;
			height: 80upx;
			// padding: 0 40upx;
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28upx;
		}
		.joinCart {
			background-color: #d19c60;
		}
		.buy {
			background-color: #f14e4f;
		}
	}
}
.popup {
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 20;
	display: none;
	.mask {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 21;
		background-color: rgba(0, 0, 0, 0.6);
	}
	.layer {
		position: fixed;
		z-index: 22;
		bottom: -70%;
		width: 92%;
		padding: 0 4%;
		height: 70%;
		border-radius: 20upx 20upx 0 0;
		background-color: #fff;
		display: flex;
		flex-wrap: wrap;
		align-content: space-between;
		.content {
			width: 100%;
			padding: 20upx 0;
		}
		.btn {
			width: 100%;
			height: 100upx;
			.button {
				width: 100%;
				height: 80upx;
				border-radius: 40upx;
				color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #f47952;
				font-size: 28upx;
			}
		}
	}

	&.show {
		display: block;
		.mask {
			animation: showPopup 0.2s linear both;
		}
		.layer {
			animation: showLayer 0.2s linear both;
		}
	}
	&.hide {
		display: block;
		.mask {
			animation: hidePopup 0.2s linear both;
		}

		.layer {
			animation: hideLayer 0.2s linear both;
		}
	}
	&.none {
		display: none;
	}
	&.service {
		.row {
			margin: 30upx 0;
			.title {
				font-size: 30upx;
				margin: 10upx 0;
				display: flex;
				align-items: center;
				.iconBox {
					margin-top: 5upx;
					margin-right: 10upx;
				}
			}
			.description {
				font-size: 28upx;
				color: #999;
			}
		}
	}
	&.spec {
		.title {
			font-size: 30upx;
			margin: 30upx 0;
		}
		.sp {
			display: flex;
			view {
				font-size: 28upx;
				padding: 5upx 20upx;
				border-radius: 8upx;
				margin: 0 30upx 20upx 0;
				background-color: #f6f6f6;
				&.on {
					padding: 3upx 18upx;
					border: solid 1upx #f47925;
				}
			}
		}
		.length {
			margin: 30upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-top: 20upx;
			.text {
				font-size: 30upx;
			}
			.number {
				display: flex;
				justify-content: center;
				align-items: center;
				.input {
					width: 80upx;
					height: 60upx;
					margin: 0 10upx;
					background-color: #f3f3f3;
					display: flex;
					justify-content: center;
					align-items: center;
					text-align: center;
					input {
						width: 80upx;
						height: 60upx;
						display: flex;
						justify-content: center;
						align-items: center;
						text-align: center;
						font-size: 26upx;
					}
				}

				.sub,
				.add {
					width: 60upx;
					height: 60upx;
					background-color: #f3f3f3;
					border-radius: 5upx;
					.icon {
						font-size: 30upx;
						width: 60upx;
						height: 60upx;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}
			}
		}
	}
	.config {
		    height: calc(100% - 100upx);
		.a-t {
			display: flex;
			margin-top: 20upx;
			image {
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				border-radius: 8upx;
			}
			.right {
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: 24upx;
				color: #666;
				line-height: 42upx;
				.price {
					font-size: 40upx;
					color: #a7241b;
					margin-bottom: 10upx;
				}
				.selected-text {
					margin-right: 10upx;
				}
			}
		}
		.configList {
			// height: 50%;
			margin: 20upx 0;
			height: calc(100% - 350upx);
			overflow: auto;
		}
		.attr-list {
			display: flex;
			flex-direction: column;
			font-size: 30upx;
			padding-top: 5upx;
		}
		.item-list {
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;
			text {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				border: 1upx solid #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 20upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: 24upx;
				color: #000;
			}
			.selected {
				background: #fef7f6;
				border: 1upx solid #b02920;
				color: #b02920;
			}
			.valid {
				background: white;
				color: white;
			}
		}
		.btn {
			position: fixed;
			bottom: 20upx;
			left: 4%;
			right: 4%;
			width: 92%;
			box-sizing: border-box;
			height: 80upx;
			border-radius: 40upx;
			overflow: hidden;
			display: flex;
			.joinCart,
			.buy {
				width: 50%;
				height: 80upx;
				color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28upx;
			}
			.joinCart {
				background-color: #d19c60;
			}
			.buy {
				background-color: #f14e4f;
			}
		}
	}
}
.share {
	display: none;
	&.show {
		display: block;
		.mask {
			animation: showPopup 0.15s linear both;
		}
		.layer {
			animation: showLayer 0.15s linear both;
		}
	}
	&.hide {
		display: block;
		.mask {
			animation: hidePopup 0.15s linear both;
		}

		.layer {
			animation: hideLayer 0.15s linear both;
		}
	}
	&.none {
		display: none;
	}
	.mask {
		background-color: rgba(0, 0, 0, 0.5);
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		z-index: 11;
	}
	.layer {
		width: 92%;
		position: fixed;
		z-index: 12;
		padding: 0 4%;
		top: 100%;
		background-color: rgba(255, 255, 255, 0.9);
		.list {
			width: 100%;
			display: flex;
			padding: 10upx 0 30upx 0;
			.box {
				width: 25%;
				display: flex;
				justify-content: center;
				flex-wrap: wrap;
				image {
					width: 13.8vw;
					height: 13.8vw;
				}
				.title {
					margin-top: 10upx;
					display: flex;
					justify-content: center;
					width: 100%;
					font-size: 26upx;
				}
			}
		}
		.btn {
			width: 100%;
			height: 100upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28upx;
			border-top: solid 1upx #666666;
		}
		.h1 {
			width: 100%;
			height: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 34upx;
		}
	}
}
</style>
