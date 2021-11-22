<template>
	<view>
		<view class="header" :style="{ position: headerPosition, top: headerTop }">
			<view class="targetBox">
			<view class="target" v-for="(target, index) in orderbyList" @tap="select(index)" :key="index" :class="[target.selected ? 'on' : '']">
				{{ target.text }}
				<view v-if="target.orderbyicon"  class="sorting">
					<uni-icons type="arrowup" size="12" color="#666" class="iconbtn" :class="target.selected&&target.orderbyicon[target.orderby]=='up'?'on':''"></uni-icons>
					<uni-icons type="arrowdown" size="12" color="#666" class="iconbtn" :class="target.selected&&target.orderbyicon[target.orderby]=='down'?'on':''"></uni-icons>
				</view>
			</view>
			</view>
			<view class="screen"  @click="toggleCateMask('show')">
				筛选<image src="../../../static/img/shaixuan.png" mode="widthFix"></image>
			</view>				
		</view>
		<!-- 占位 -->
		<view class="place"></view>
		<!-- 商品列表 -->
		<goodsList :productList="productList" :loadingText="loadtext"></goodsList>
				
	<!-- 筛选弹框 -->
	<view class="cate-mask" :class="cateMaskState===0 ? 'none' : cateMaskState===1 ? 'show' : ''" @click="toggleCateMask">
		<view class="cate-content" >
			<scroll-view scroll-y class="cate-list" @click.stop="stopClick">
				<view v-for="(item,index) in searchList" :key="item.value">
					<view class="cate-item b-b two">{{item.name}}</view>
					<checkbox-group @change="checkboxChange($event,item,index)">
					    <label class="uni-list-cell uni-list-cell-pd" v-for="(tItem,tindex) in item.child" :key="tItem.value">
					        <view hidden>
					            <checkbox  :value="tItem.value" :checked="tItem.checked" />
					        </view>
					        <view class="cate-item b-b checkItem " :class="tItem.checked?'active':''" >{{tItem.name}}</view>
					    </label>
					</checkbox-group>
				</view>								            
			</scroll-view>
			<view class="footer">
				<view class="btn remake" @click.stop="remakeClick">重置</view>									
				<view class="btn confirm" @click.stop="confirmClick">确定</view>									
			</view>
		</view>
		
	</view>
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
			loadtext: "上拉加载更多",
			tag_id:0,
			page: 1,
			total: 0,
			productList: [],
			headerTop: '0px',
			headerPosition: 'fixed',
			cateMaskState: 0,
			orderbyList: [
				{ text: '综合', selected: true, orderbyicon: false, orderby: 0 },
				{ text: '新品', selected: false, orderbyicon: false, orderby: 0 },
				{ text: '价格', selected: false, orderbyicon: ['up', 'down'], orderby: 0 },
				{ text: '信用', selected: false, orderbyicon: false, orderby: 0 }
			],
			orderby: 'sheng',
			config: {}, //已选三级分类id
			searchList:[],			
			}
	},
	onLoad: function(option) {
		this.tag_id = option.cid
		this.getProductList()
		this.getSearchList()
		uni.setNavigationBarTitle({title: option.name});
		//兼容H5下排序栏位置
		// #ifdef H5
		//定时器方式循环获取高度为止，这么写的原因是onLoad中head未必已经渲染出来。
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
		if (e.scrollTop >= 0) {
			this.headerPosition = 'fixed';
		} else {
			this.headerPosition = 'absolute';
		}
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
		getSearchList(){
			this.$H.get(this.$A.m().appSearchList, {}).then(res => {					
				this.searchList = res
				})
		},
		
		getProductList(refresh = true, callback = false) {
			let page = refresh ? 1 : this.page
			this.$H.get(this.$A.m().productList, {page: page, tag_id:this.tag_id
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
		reload() {
			console.log('reload');

		},

		//排序类型
		select(index) {
			let tmpTis = this.orderbyList[index].text + '排序 ';
			if (this.orderbyList[index].orderbyicon) {
				let type = this.orderbyList[index].orderby == 0 ? '升序' : '降序';
				if (this.orderbyList[index].selected) {
					type = this.orderbyList[index].orderby == 0 ? '降序' : '升序';
					this.orderbyList[index].orderby = this.orderbyList[index].orderby == 0 ? 1 : 0;
				}
				tmpTis += type;
			}
			this.orderbyList[index].selected = true;
			let len = this.orderbyList.length;
			for (let i = 0; i < len; i++) {
				if (i != index) {
					this.orderbyList[i].selected = false;
				}
			}
			uni.showToast({ title: tmpTis, icon: 'none' });
		},
		//显示分类面板
		toggleCateMask(type){
			let timer = type === 'show' ? 10 : 300;
			let	state = type === 'show' ? 1 : 0;
			this.cateMaskState = 2;
			setTimeout(()=>{
				this.cateMaskState = state;
			}, timer)
		},
		stopClick() {},
		//分类点击
		checkboxChange (e,item,index) {
			let key = item.value
			this.config[key]=e.detail.value
			console.log(this.config)
		                var newList = this.searchList[index].child,
		                    values = e.detail.value;
		                for (var i = 0, lenI = newList.length; i < lenI; ++i) {
		                    const res = newList[i]
		                    if(values.includes(res.value)){
		                        this.$set(res,'checked',true)
		                    }else{
		                        this.$set(res,'checked',false)
		                    }
		                }
		            },
		confirmClick() {
			console.log(this.starePrice,this.endPrice)
			this.cateMaskState = 2;
			setTimeout(()=>{
				this.cateMaskState = 0;
			}, 300)
		},
		remakeClick() {
			this.config = ''
			this.cateMaskState = 2;
			setTimeout(()=>{
				this.cateMaskState = 0;
			}, 300)
			// 刷新页面
			uni.redirectTo({
				url:'/pages/goods/goods-list/goods-list'
			})
		}
	}
};
</script>

<style lang="scss">
.icon {
	font-size: 26upx;
	overflow: auto;
}
.header {
	width: 96%;
	padding: 0 2%;
	height: 79upx;
	display: flex;
	justify-content: space-around;
	align-items: flex-end;
	position: fixed;
	top: 0;
	z-index: 10;
	background-color: #fff;
	border-bottom: solid 1upx #eee;
	.targetBox {
		width: 86%;
		display: flex;
		align-items: center;
	.target {
		width: 25%;
		height: 60upx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		margin-bottom: -2upx;
		&.on {
			color: #d91a36;
			border-bottom: 4upx solid #d91a36;
			font-weight: 600;
			font-size: 30upx;
		}
		.sorting {
			display: flex;
			flex-direction: column;
				font-size: 28upx;
				margin-left: 1%;
			// transform: scale(0.6);
			.iconbtn {
				margin:-8upx 0 ;
			&.on {
				color: #d91a36 !important;
				/* #ifdef MP */
				text {
					color: #d91a36 !important;
				}
				/* #endif */
			}
			}
		}
	}
	}
.screen {
	width: 13%;
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28upx;
	height: 60upx;
	image {
		width: 28upx;
		height: 40upx;
	}
}
}
.place {
	background-color: #ffffff;
	height: 100upx;
}

/* 分类 */
	.cate-mask{
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0,0,0,0);
		z-index: 95;
		transition: .3s;		
		.cate-content{
			width: 630upx;
			height: 100%;
			background: #fff;
			float:right;
			transform: translateX(100%);
			transition: .3s;
			.footer {
				display: flex;
				justify-content: space-around;
				background-color: #fff;
				margin-top: 20upx;
				.btn {
					width: 40%;
					height: 80upx;
					line-height: 80upx;
					border: 1px solid #666;
					border-radius: 50upx;
					text-align: center;
					&.confirm {
						color: #fff;
						border: 1px solid #d8122e;
						background-color: #d8122e;
					}
				}
			}
		}
		&.none{
			display: none;
		}
		&.show{
			background: rgba(0,0,0,.6);
			
			.cate-content{
				transform: translateX(0);
			}
		}
		
	}
	.cate-list{
		display: flex;
		flex-direction: column;
		height: 90%;
		.cate-item{
			display: flex;
			align-items: center;
			height: 90upx;
			padding-left: 30upx;
 			font-size: 28upx;
			color: #555;
			position: relative;
			&.checkItem {
				display: flex;
				width: 150upx;
				text-align: center;
					height: 60upx;
					line-height: 60upx;
					padding-left: 0;
					display: inline-block;
					background-color: #f4f4f4;
					border-radius: 40upx;
					margin: 10upx;
			}
		}
		.two{
			height: 64upx;
			color: #303133;
			font-size: 30upx;
		}
		.active{
			color: #b02920;
			background-color: #f5eded;
			border: 1upx solid #b02920;
		}
	}

</style>
