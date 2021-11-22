<template>	
	
	<view class="row" >
	<view v-if="isSelect"  class="left" >
		<uni-icons type="star"  size="25"  @click="selectAddress(address.id,delivery_type,address_type)"/>	
	</view>	
						
	<view  class="addr" >
		<view class="right">
			<text v-if ="!list" class="selected">{{title}}</text> 			
			<view class="tel-name">				
				<view class="name">{{address.consignee }}</view>
		
			</view>
			<view class="tel-name">
		
				<view class="name">{{ address.email}}</view>
				<view class="tel">{{address.tel}}</view>
			</view>
			<view class="addres">{{detailAddress }} </view>
			
			
			<view v-if= "list == 1" class="btn">			
				<text :class="address.is_default_delivery==1?'selected':''" @tap="setDefault(address.id, address.is_default_delivery,'t')">默认送货 </text>
				<text :class="address.is_default_bill==1?'selected':''" @tap="setDefault(address.id,address.is_default_bill,'b')">默认账单 </text>
								
				<view class="btn1">	
					<view style="font-size: small;" class="icon bianji" @click="edit"/>					 											
				</view>
				<view class="btn2">
						<view style="font-size: small;" class="icon shanchu" @click="remove"/>
				</view>
			</view>						
			</view>
		</view>						
	</view>	
		
	</view>
	




</template>

<script>
	export default {
		props:{
		   delivery_type: Number,	
		   address_type:String,
		   address:Object,
		   list:Boolean,
		   isSelect:Boolean,
		},

		computed: {
			title(){
				let t = null
				if(this.list){
					if(this.address.is_default_delivery == 1){
						t = '默认送货'
						if(this.address.is_default_bill == 1){
							t = '默认地址'
						}else{
							t = '默认账单'
						}
					}
					
				} else{
					if(this.address_type == 'b'){
						t = '账单地址'
					} else{
						t = '收货地址'
					}
				}
				

				return t	
			},
		
		detailAddress() {
		  	return this.address.street + ' ' + this.address.house_number + ' ' + 
					this.address.postcode + ' ' + this.address.city + ' ' + this.address.country
		  },
			
		},
		methods:{
			selectAddress(id,t1,t2) {		
				this.$emit('selectAddress', id, t1,t2)
			},
			
			setDefault(id,d,t) {				
				this.$emit('setDefault',id,d,t)								
			},
			
			edit(){
				this.$emit('edit',this.address)	
			},
			
			remove(){
				this.$emit('remove',this.address)	
			},
		},

	}
</script>

<style lang="scss">
	.row{
		display: flex;
		align-items: center;
		
		.left{
			width: 10%;
		}		
		.addr {
			width: 90%;
			padding: 10upx 9%;
			margin: 15upx auto 20upx auto;
			padding:10upx;
			box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
			border-radius: 20upx;
			display: flex;
			line-height: 1.5;	
			text {
				width: 25%;
				font-size: 16upx;
				background: #eee;
				border: 1upx solid #eee;
				color: #000;
				padding: 7upx;
				border-radius: 10upx;
				margin-right: 20upx;
				height: 36upx;
				line-height: 36upx;
				flex-shrink: 0;
				}
				
				.selected {
					background: #fef7f6;
					border: 1upx solid #b02920;
					color: #b02920;
				}
			.tel-name {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-end;
				font-size: 30upx;			
				.name {			
					font-size: 30upx;
				}
				.tel {
					margin-left:30upx;
					font-size: 26upx;
				}
				.email {
					margin-left: 30upx;
					font-size: 26upx;
				}
			}
		
			.addres {
				width: 100%;
				font-size: 26upx;
				color: #999;
			}
			.btn {
				display: flex;
				width: 100%;													
				align-items: flex-start;
				font-size: 28upx;
				height: 40upx;
				
				.btn1 {
						justify-content: center;
						align-items: center;
						width: 68upx;
						padding-left: 10upx;
						padding-right: 10upx;
						height: 60upx;
						
						font-size: 28upx;
						color: #777;
						}
		
				.btn2 {					
						justify-content: center;
						align-items: center;
						}
						
					}			
		}
	}
	
	

</style>
