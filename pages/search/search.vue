<template>
	<view>
		<zy-search :is-focus="false" :theme="themeClass" :show-want="true" :speechEngine="speechEngine"
		:hot-list="hotList" @getSearchText="getSearchText"></zy-search>
		<view v-if="show_result">			
			<goodsList :title="getTitle" :productList="productList" :loadingText="loadtext"/>
		</view>				
	</view>
</template>

<script>
	import zySearch from '../../components/zy-search/zy-search.vue'
	import goodsList from '@/components/home/goods-list.vue'

	export default {
		components: {
			zySearch,goodsList
		},
		data() {
			return {
				themeClass: 'block',
				
				speechEngine: 'baidu', //语音识别引擎
				hotList: []	,//初始化推荐列表
				loadtext: "上拉加载更多",
				tag_id:0,
				page: 1,
				total: 0,
				productList: [],
				keyword:'',
				show_result: false
			}
		},
		computed: {
			getTitle(){
				if(this.productList.length == 0){
				   return "没找着符合 "+this.keyword +" 的任何信息"
				} else{
					return "共找到符合 "+this.keyword + " 的 "+this.productList.length +" 搜索记录"
				}
			}
		},
		onLoad() {
			this.getHotList()

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
		methods: {
			getHotList() {
				this.$H.get(this.$A.m().search).then(res => {
					this.hotList = res						
				})
			},
			
			// 加载数据
			getProductList(refresh = true, callback = false) {
				let page = refresh ? 1 : this.page
				this.$H.get(this.$A.m().productList, {page: page, keyword:this.keyword
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
			getSearchText(e) {
				this.keyword = e
				if(this.keyword.length > 0){
					this.show_result = true
					this.getProductList()
				} else{
					show_result = false
					this.productList= []
				}
									
			}
		},
	}
</script>

<style lang="scss">
	.uni-page-head .uni-btn-icon{
		display: none;
	}
</style>
