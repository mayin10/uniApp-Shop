<template>
	<view>
		<image :src=imgBg mode="widthFix" class="bgimgBox"></image>
		<view class="logo">
			<view class="img"><image :src=imglogo mode="widthFix"></image></view>
		</view>				
		<view class="form re">
			<view class="username">
				<input placeholder="请输入用户名" v-model="account" />
			</view>
			<view class="password"><input placeholder="请输入Email" v-model="email" /></view>
			<view class="password"><input placeholder="请输入密码" v-model="passwd" password="true" /></view>
			<view class="btn" @tap="doReg">立即注册</view>
			<view class="res"><view @tap="toLogin">已有账号立即登录</view></view>
		</view>
	</view>
</template>

<script>
import md5 from '@/common/SDK/md5.min.js';
import {mapMutations} from 'vuex';
export default {
	data() {
		return {
			imglogo:'../../static/img/myShop/logo.png',
			imgBg:'../../static/img/myShop/loginBg.png',
			account: '',
			email: '',
			passwd: ''
		};
	},
	onLoad() {},
	methods: {
		...mapMutations(['login']),
		doReg(){
			uni.hideKeyboard();				
			this.$H.post(this.$A.m().register,{
				username: this.account,
				password: this.passwd,
				email:this.email
			}).then(res=>{
				this.login(res)
				uni.switchTab({url: '/pages/tabBar/home/home'})
			})
		},
		
		toLogin() {
			uni.hideKeyboard();
			uni.redirectTo({ url: 'login' });
			uni.navigateBack();
		}
		
	}
};
</script>

<style lang="scss">
@import '../../static/css/login.scss';
</style>
