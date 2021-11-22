<template>
	<view>
		<image :src=imgBg mode="widthFix" class="bgimgBox"></image>
		<view class="logo">
			<view class="img"><image :src=imglogo mode="widthFix"></image></view>
		</view>		
		<view class="form">
			<view  class="username"><input placeholder="请输入账号" v-model="account" /></view>			
			<view  class="password">
				<input placeholder="请输入密码" v-model="passwd" :password="passwordStatus" />
				<uni-icons v-if="!passwordStatus" type="eye-filled" size="18" @click="passwordStatus = true"></uni-icons>
				<uni-icons v-if="passwordStatus" type="eye-slash-filled" size="18" @click="passwordStatus = false"></uni-icons>
			</view>
			<view class="btn" @tap="doLogin">登 录</view>						
			<view class="goWay" @click="loginWay = 'default'">用户名密码登录</view>
			<view class="res">
				<view @tap="toPage('register')">用户注册</view>
				<view @tap="toPage('resetpasswd')">忘记密码</view>
			</view>
		</view>
		<!-- 第三方登录 -->
		<view class="oauth" v-if="isShowOauth">
			<view class="text">— 微信登录 —</view>
			<view class="list">
				<view @tap="oauthLogin('weixin')" v-if="showProvider.weixin" class="icon weixin"></view>				
			</view>
		</view>
	</view>
</template>

<script>
import md5 from '@/common/SDK/md5.min.js';
import {mapState,mapMutations} from 'vuex';
export default {
	data() {
		return {
			imglogo:'../../static/img/myShop/logo.png',
			imgBg:'../../static/img/myShop/loginBg.png',
			account: '',
			passwd: '',
			passwordStatus: true,
			getCodeisWaiting: false,
			isShowOauth: true,
			showProvider: {
				weixin: false,	
			}
		};
	},
	
	computed: {
		...mapState({
			loginStatus: state => state.user.loginStatus,
		}),
		
	},
	onShow() {},
	onLoad() {
		if(this.loginStatus){
			uni.$emit('updateAddress')
			uni.$emit('updateCart')
			uni.switchTab({url: '/pages/tabBar/home/home'})
		}
		//APP显示第三方登录
		// #ifdef APP-PLUS
		this.isShowOauth = true;
		// #endif
		this.getProvider();
	},
	methods: {
		...mapMutations(['login']),
		goBack(){uni.navigateBack({delta: 1});},
				
		oauthLogin(provider) {
			uni.showLoading();
			//第三方登录
			uni.login({
				provider: provider,
				success: loginRes => {
					uni.getUserInfo({
						provider: provider,
						success: infoRes => {
							this.doReg(infoRes.userInfo)	
						}
					});
				},
				fail: e => {
					console.log('fail: ' + JSON.stringify(e));
				}
			});
		},
		
		doReg(userInfo){
			//uni.hideKeyboard();							
			let weixindata ={
				'weixin':1,
				'username':userInfo.nickName,
				'nickname':userInfo.nickName,
				'wechat_openid':userInfo.openId,
				'wechat_unionid':userInfo.unionId,
				'wechat_headimgurl':userInfo.avatarUrl,
				'gender':userInfo.gender,
				'city':userInfo.city,
				'province':userInfo.province,
				'country':userInfo.country,														
			}																																
			this.$H.post(this.$A.m().register, weixindata).then(res=>{
					this.afterLogin(res)
			})
		},
		
				
		getProvider() {
			//获取第三方登录服务
			uni.getProvider({
				service: 'oauth',
				success: res => {
					//console.log(res)
					let len = res.provider.length;
					for (let i = 0; i < len; i++) {
						//有服务才显示按钮图标
						this.showProvider[res.provider[i]] = true;
						this.isShowOauth = true;
					}
					if (res.provider.length == 0) {
						this.isShowOauth = false;
					}
				}
			});
		},
		toPage(page) {
			uni.hideKeyboard();
			uni.navigateTo({
				url: page
			});
		},

		doLogin() {
			uni.hideKeyboard();
			if(this.account.length < 2){
				uni.showToast({ title: '请输入用戶名', icon: 'none' });
				return
			}
			if(this.passwd.length < 2){
				uni.showToast({ title: '请输入密码', icon: 'none' });
				return
			}
			let data = {username:this.account, password:this.passwd}
			let token = {token:false}
			this.$H.post(this.$A.m().login,data,token).then(res=>{	
				this.afterLogin(res)				
			})						
		},
		
		afterLogin(res){
			uni.showToast({title: '登录成功',icon: 'none'});
			this.login(res)
			uni.$emit('updateAddress')
			uni.$emit('updateCart')
			uni.switchTab({url: '/pages/tabBar/home/home'})
		}
		
	}
};
</script>

<style lang="scss">
@import '../../static/css/login.scss';

.form {
	.goWay {
		color: #666;
		padding: 30upx 20upx;
	}
	.res {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100upx;
		color: rgba($color: #9b9b9b, $alpha: 0.8);
		view {
			padding: 0 20upx;
			&:last-child {
				border-left: 1px solid #666;
			}
		}
	}
}
.oauth {
	@media all and (max-height: 150vw) {
		display: none;
	}
	position: absolute;
	bottom: 50upx;
	width: 100%;
	.text {
		width: 100%;
		height: 60upx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: rgba($color: #222222, $alpha: 0.8);
		font-size: 28upx;
	}
	.list {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20upx 0;
		.icon {
			color: #666;
			font-size: 80upx;
			margin: 0 30upx;
		}
	}
}
</style>
