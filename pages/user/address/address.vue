<template>
	<view>				
		<view  v-for="(row,index) in addressList" :key="index">			
			<myAddres :list= "is_list" :isSelect="isSelect" :address="row" @selectAddress = "changeAddress" @setDefault ="setDefault"
				@edit ="edit" @remove ="remove" />
		</view>
		
		<view class="add">
			<view class="btn" @tap="add">
				<view class="icon tianjia">新增地址</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	import myAddres from '@/components/home/my-address.vue'
	export default {
		components: {myAddres},
		data() {
			return {
				is_list:true,
				isSelect:false,
				delivery_type:0,
				address_type:0,				
			}
		},
	computed: {
		...mapState({				
			userInfo: state => state.user.userInfo,	
			addressList: state => state.cart.addressList,
			cartList: state => state.cart.cartlist,
			addressChecked:state =>state.cart.addressChecked,	
		}),	
	},
		onShow() {

		},
		onLoad(e) {
			if(e.type=='select'){
				this.isSelect = true
				this.delivery_type = e.delivery_type
				this.address_type = e.address_type
				if(this.address_type == 't'){
					uni.setNavigationBarTitle({title: '选择送货地址'})
				}else{
					uni.setNavigationBarTitle({title: '选择账单地址'})
				}
				
			}
		},
		methods:{
			...mapMutations([		
				'selectAddress',
				'checkAddress',				
			]),

			changeAddress(id){				
				if(this.isSelect){					
				  let p = id + '-' + this.delivery_type + '-' +this.address_type
				  this.selectAddress(p)		
				}
			},

			 setDefault(id,d,t){				
				 if(d == 1){
					return 
				 }				 
				let data = {
					cur_user_id: this.userInfo.id,
					id: id,
					type:t
				}			
				let token = {token: true}
				this.$H.post(this.$A.m().appChangeDefault, data, token).then(res => {
					this.addressList.forEach(v=>{
						 if(t == 't'){
							if(v.id == id){
									v.is_default_delivery =1
							}else{
									v.is_default_delivery =0
							} 
						}
						 
						 if(t == 'b'){
							if(v.id == id){
									v.is_default_bill =1
							}else{
									v.is_default_bill =0
							} 
						}					 					 
					 }) 														
					uni.showToast({title: '地址状态已经更新',icon: 'none'});	
				})																																										 
			 },

			edit(address){
			 this.checkAddress(address)
              console.log(this.addressChecked)
			  if(this.addressChecked){
				  uni.navigateTo({url:"edit/edit?type=edit&address_id="+address.id})
			  }
			},
			
			remove(address){
				this.checkAddress(address)
				let i = -1
				if(this.addressChecked){				
					this.$H.del(this.$A.m().appDeleteAddress,{id:address.id},{token:true}).then(res=>{
					   this.addressList.forEach((v,index)=>{
					   		if(v.id == address.id){
					   			i= index
					   		}
					   	}
					   )
					   this.addressList.splice(i,1)										
					})													
				}			   
			},
			
			add(){
				uni.navigateTo({url:"edit/edit?type=add"})
			},
		}
	}
</script>

<style lang="scss">
	.add{
		display: flex;
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 120upx;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		.btn{
			width: 90%;
			height: 80upx;
			border: 1upx solid #8b6945;
			border-radius: 10upx;
			text-align: center;
			color: #8b6945;
			justify-content: center;
			align-items: center;
			.icon{
				height: 80upx;
				color: #8b6945;
				font-size: 30upx;
				justify-content: center;
				align-items: center;
			}
			font-size: 30upx;
		}
	}
	.list{
		flex-wrap: wrap;
		.row{
			width: 100%;
			padding: 10upx 1%;
			border-bottom: 1upx solid #eee;							
		}
	}
</style>
