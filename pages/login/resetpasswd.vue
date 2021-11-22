<template>
	<view>
     <image :src=imgBg mode="widthFix" class="bgimgBox"></image>
     <view class="logo">
     	<view class="img"><image :src=imglogo mode="widthFix"></image></view>
     </view>
		<view class="form re">
			<view class="username" v-if="type!=1">
				<view class="get-code" :style="{'color':getCodeBtnColor}" @click.stop="sendCode()">{{getCodeText}}</view>
				<input placeholder="请输入正确的Email地址" v-model="email" />
			</view>
			<view class="code" v-if="type!=1">
				<input placeholder="请输入验证码" v-model="code" />
			</view>
			<view class="password">
				<input placeholder="请输入新密码" v-model="passwd" password=true />
			</view>
			<view class="password">
				<input placeholder="再次输入新密码" v-model="confirm_passwd" password=true />
			</view>
			<view class="btn" @tap="doReset">重置密码</view>

		</view>
		
	</view>
</template>

<script>
	import md5 from "@/common/SDK/md5.min.js";
	export default {
		data() {
			return {
				type:0,
				imglogo:'../../static/img/myShop/logo.png',
				imgBg:'../../static/img/myShop/loginBg.png',
				email:"jina2016001@gmail.com",
				code:'',
				passwd:"",
				confirm_passwd:"",
				getCodeText:'获取验证码',
				getCodeBtnColor:"#be9d6b",
				getCodeisWaiting:false
			}
		},
		onLoad(e) {
		  this.type = e.type    		
		},
		methods: {
			//appPswReset
			sendCode(){
				let data = {email:this.email}
				this.$H.post(this.$A.m().appCodeVerify, data, {
					token: true
				}).then(res => {
						uni.showToast({title: res.msg,icon: 'none'})						
				})
			},
						
			doReset(){
				uni.hideKeyboard()
				if(this.code.length == 0){
					uni.showToast({title: '请输入验证码',icon: 'none'});
					return
				}
				
				if(this.passwd.length == 0){
					uni.showToast({title: '请输入新密码',icon: 'none'});
					return
				}
				if(this.passwd.length < 6){
					uni.showToast({title: '密码最少要6位',icon: 'none'});
					return
				}
				if(this.passwd != this.confirm_passwd){
					uni.showToast({title: '两次输入的密码不一致， 请检查',icon: 'none'});
					return
				}
				
				let data = {token:this.code, email:this.email,password:this.passwd,}
				this.$H.post(this.$A.m().appPswReset, data, {
					token: true
				}).then(res => {
						uni.showToast({title: res.msg,icon: 'none'})
						uni.navigateTo({url: '/pages/login/login'});						
				})
						
			}
		}
	}
</script>

<style lang="scss">
	@import "../../static/css/login.scss";	
</style>
