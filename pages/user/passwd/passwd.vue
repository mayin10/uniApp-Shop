<template>
	<view>
		<view class="content">			
			<view class="row">	
				<view class="nominal">当前密码</view>
				<view class="input">
					<input placeholder="请输入当前密码"  v-model="alt_pwd" password=true/>
				</view>
			</view>
			<view class="row">
				<view class="nominal">新密码</view>
				<view class="input">
					<input placeholder="请输入新密码" v-model="new_pwd" password=true  />
				</view>
			</view>	
			<view class="row">
				<view class="nominal">确认新密码</view>
				<view class="input">
					<input placeholder="请再输入新密码"  v-model="confirm_pwd" password=true/>
				</view>
			</view>		
																																									
		</view>
		<view class="save" @tap="save">
			<view class="btn">保存密码</view>
		</view>
	</view>
</template>

<script>	
	import {mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				alt_pwd:'',
				new_pwd:'',
				confirm_pwd:'',								
			}
		},
		
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo,			
			})
		},
		onLoad(e) {
									
		},
		methods: {	
											
			save(){									
					if(!this.alt_pwd){
						uni.showToast({title:'请输入输入当前密码',icon:'none'});
						return ;
					}
					if(!this.new_pwd){
						uni.showToast({title:'请输入请输入新密码',icon:'none'});
						return ;
					}
					if(!this.confirm_pwd){
						uni.showToast({title:'请再输入新密码',icon:'none'});
						return ;
					}
					if(this.new_pwd != this.confirm_pwd){
						uni.showToast({title:'两次输入的新密码不一致',icon:'none'});
						return ;
					}
												
				let data  = {
						user_id:this.userInfo.id,
						alt_pwd : this.alt_pwd,
						new_pwd:this.new_pwd,												
					}
				
				this.$H.post(this.$A.m().appPswModify,data,{token:true}).then(res=>{
					uni.showToast({title:'密码已经修改',icon:'none'});
					uni.switchTab({
						url: '/pages/tabBar/user/user'
					})										
				})					
										
			} 
		},

	};
</script>
<style lang="scss">
page {
	background-color: #f3f3f3;
}
.save{
		view{
			display: flex;
		}
		position: fixed;
		bottom: 630upx;
		width: 100%;
		height: 120upx;
		display: flex;
		justify-content: center;
		align-items: center;
		.btn{
			width: 90%;
			height: 80upx;
			border: 1upx solid #8b6945;
			border-radius: 50upx;
			text-align: center;
			color: #8b6945;
			justify-content: center;
			align-items: center;
			.icon{
				height: 80upx;
				color: #fff;
				font-size: 30upx;
				justify-content: center;
				align-items: center;
			}
			font-size: 30upx;
		}
	}
	.content{
		display: flex;
		flex-wrap: wrap;
		view{
			display: flex;
		}
		.row{
			width: 90%;
			padding: 0 3%;
			border-top: solid 1upx #eee;
			border: solid 1upx #eee;
			background-color: #fff;
			align-items:center;
			margin: 20upx;
			border-radius: 50upx;			
			.nominal{
				width: 25%;
				height: 100upx;
				font-weight: 200;
				font-size: 30upx;
				
				align-items: center;
				
			}
			.input{
				height: 80upx;
				width: 75%;
				padding: 10upx 0;
				align-items: center;
				font-size: 20upx;				
				input{
					width: 100%;					
				}
			}

		}
	}
	
</style>
