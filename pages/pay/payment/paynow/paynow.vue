<template>
	<view>		
		<view>
			<web-view :src="url"></web-view>
		</view>
	</view>

</template>

<script>
	import {mapState} from "vuex"
	export default {
		data() {
			return {
				order_nr: '',
				totalPrice:100,			
				timer: null,
				url: '',
				index:0,
				
			}
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo,
			}),		
		},
		onLoad(e) {
			this.order_nr =e.order_nr
		    this.totalPrice = parseFloat(e.amount).toFixed(2)
			this.paynow()					
		},

		mounted(){		
		  this.timer = setInterval(this.getOrder, 1000)
		},
		beforeDestroy() {
		    clearInterval(this.timer);        
		    this.timer = null;
		},
		methods: {
			getOrder() {
				this.$H.get(this.$A.m().appGetOrder, {
					order_nr: this.order_nr,
					
				}).then(res => {
					let ok = true
					res.forEach(item=>{
						if(item.status == 10){
							ok = false
						}
					})
					if(ok){
						uni.redirectTo({
							url: '/pages/pay/success/success?amount=' + this.totalPrice+'&type=0'
						})
					}
																			
					this.index ++
					//899				
					if(this.index == 900){
						uni.redirectTo({														
							url: '/pages/pay/success/success?amount=' + this.totalPrice+'&type=1'
						})
					}
				})
			},
			paynow() {
				//appPaynow
				let params ={order_sn: this.order_nr,amount:this.totalPrice,email:this.userInfo.email}
				this.$H.get(this.$A.m().appPaynow, params).then(res => {
					this.url = res.url;
				})
			},
		}
	}
</script>

<style lang="scss">

</style>
