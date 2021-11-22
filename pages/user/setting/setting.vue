<template>
	<view>
		<view class="content">
			<view class="list">
				<view class="row" @click="portraitClick">
					<view class="title">头像</view>
					<view class="right">
						<view class="tis">
							<image :src="getFace" mode="widthFix"></image>
						</view>
						<view class="icon xiangyou"></view>
					</view>
				</view>
			</view>
			<view class="list">
				<view class="row">
					<view class="title">邮箱 <text class="yanzhen" v-if="userInfo.status == 0" @click="toVerify">
							去验证</text></view>
					<view class="right">
						<view class="tis">{{userInfo.email }}</view>
						<view class="icon xiangyou"></view>
					</view>
				</view>
			</view>
			<view class="list" @click="goAddress">
				<view class="row">
					<view class="title">地址管理</view>
					<view class="right">
						<view class="tis"></view>
						<view class="icon xiangyou"></view>
					</view>
				</view>
			</view>
			<view class="list">
				<view class="row">
					<view class="title">用户名</view>
					<view class="right">
						<view class="tis">{{userInfo.username }}</view>
						<view class="icon xiangyou" @click="editUser"></view>
					</view>
				</view>
				<view class="row">
					<view class="title">性别</view>
					<view class="right">
						<view class="tis">{{getGender}}</view>
						<view class="icon xiangyou" @click="editUser"></view>
					</view>
				</view>

				<view class="row">
					<view class="title">电话</view>
					<view class="right">
						<view class="tis">{{userInfo.tel }}</view>
						<view class="icon xiangyou" @click="editUser"> </view>
					</view>
				</view>
				<view class="row">
					<view class="title">生日</view>
					<view class="right">
						<view class="tis">{{userInfo.birthday }}</view>
						<view class="icon xiangyou" @click="editUser"></view>
					</view>
				</view>
				<view class="row">
					<view class="title">所在城市</view>
					<view class="right">
						<view class="tis">{{userInfo.city }}</view>
						<view class="icon xiangyou" @click="editUser"></view>
					</view>
				</view>
				<view class="row">
					<view class="title">所在国家</view>
					<view class="right">
						<view class="tis">{{userInfo.country }}</view>
						<view class="icon xiangyou" @click="editUser"></view>
					</view>
				</view>
			</view>

		</view>
		<view class="quit" @click="quitClick">退出登录</view>
		<!-- 修改昵称弹框 -->
		<view v-if="editDialog" class="coverBox"></view>
		
		<view v-if="editDialog" class="editBox">
			<view class="title">修改个人信息</view>
			
			<view class="editform">
				<view class="label">用户名</view>
				<input type="text" :focus="editDialog" v-model="editForm.username" class="inputBox" />
			</view>

			<view class="editform">
				<view class="label">电话</view>
				<input type="text" :focus="editDialog" v-model="editForm.tel" class="inputBox" />
			</view>
			<view class="editform">
				<view class="label">生日</view>
				<input type="text" :focus="editDialog" v-model="editForm.birthday" class="inputBox" />
			</view>
			<view class="editform">
				<view class="label">所在城市</view>
				<input type="text" :focus="editDialog" v-model="editForm.city" class="inputBox" />
			</view>

			<view class="editform">
				<view class="label">所在国家</view>
				<input type="text" :focus="editDialog" v-model="editForm.country" class="inputBox" />
			</view>


			<view class="footer">
				<view class="" @click="cancelDialog">取消</view>
				<view class="confirm" @click="confirmDialog">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				imgSrc:'',
				percent:0,
				editDialog: false,	
				editForm:{},
				genderList: [{value:'m', label:'帅哥'},{value:'f', label:'美女'}],
			};
		},

		computed: {
			...mapState({
				loginStatus: state => state.user.loginStatus,
				userInfo: state => state.user.userInfo
			}),

			getFace() {
				if(this.imgSrc.length > 1){
					return this.imgSrc
				}
				if (this.userInfo.wechat_headimgurl != null) {
					return this.userInfo.wechat_headimgurl
				}
				return this.userInfo.face
			},
			getGender() {
				return this.userInfo.gender == 'm' ? '帅哥' : '美女'
			},


		},
		
		onLoad(){
			this.initEditForm()
		},
		
		methods: {
			...mapMutations(['logout']),
			showType(tbIndex) {
				this.tabbarIndex = tbIndex;
				this.list = this.orderList[tbIndex];
			},

			initEditForm(){
				this.editForm = this.userInfo
			},
			
			// 头像上传
			portraitClick() {
				var _self = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album','camera'], //从相册选择
					success: function(res) {						
						_self.imgSrc = res.tempFilePaths[0]
						console.log(_self.imgSrc)
					
						const uploadTask = uni.uploadFile({
							url: 'https://shopapi.wlsphoenix.de/appUpload',
							filePath: _self.imgSrc,
							name: 'file',
							formData: {
								user_id: _self.userInfo.id
							},
							success: function(res1) {
								console.log(res1);
								
							}
						});

						uploadTask.onProgressUpdate(function(res) {
							_self.percent = res.progress;
							console.log('上传进度' + res.progress);
							console.log('已经上传的数据长度' + res.totalBytesSent);
							console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
						});
					},
					error: function(e) {
						//console.log(e);
					}
				});
			},
			// 显示更改昵称弹框
			editUser() {				
				this.editDialog = true
			},
			cancelDialog() {
				this.editDialog = false;
			},
			confirmDialog() {
				
				this.editDialog = false;
			},
			goAddress() {
				uni.navigateTo({
					url: '/pages/user/address/address'
				});
			},
			quitClick() {
				this.logout()
				uni.navigateTo({
					url: '/pages/login/login'
				});
			},
			toVerify() {
				this.$H.post(this.$A.m().verify, {
					user_id: this.userInfo.id
				}).then(res => {
					this.quitClick()
				})
			}
		},


	};
</script>

<style lang="scss">
	page {
		background-color: #f3f3f3;
	}

	.icon {
		font-size: 30upx;
	}

	.content {
		padding-bottom: 20upx;

		.list {
			width: 96%;
			padding-left: 4%;
			background-color: #fff;
			margin-bottom: 20upx;

			.row {
				widows: 100%;
				min-height: 90upx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: solid 1upx #eee;

				&:last-child {
					border-bottom: none;
				}

				.title {
					font-size: 32upx;
					color: #333;
				}

				.yanzhen {
					padding: 2upx 10upx;
					margin-left: 10upx;
					background-color: #d85f61;
					color: #fff;
					font-size: 20upx;
					border-radius: 5upx;
				}

				.right {
					display: flex;
					align-items: center;
					color: #999;

					.tis {
						font-size: 26upx;
						margin-right: 5upx;
						max-height: 120upx;

						image {
							width: 100upx;
							height: 100upx;
							border-radius: 100%;
							margin: 10upx 0;
						}
					}

					.icon {
						width: 40upx;
						color: #cecece;
					}
				}
			}
		}
	}

	.quit {
		position: fixed;
		left: 50upx;
		right: 50upx;
		bottom: 50upx;
		line-height: 80upx;
		height: 80upx;
		border: 1upx solid #8b6945;
		border-radius: 10upx;
		text-align: center;
		color: #8b6945;
		font-size: 30upx;
	}

	.coverBox {
		background: rgba($color: #000000, $alpha: 0.6);
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1;
	}

	.editBox {
		position: absolute;
		bottom: 10upx;
		left: 10upx;
		right: 10upx;
		background-color: #ffffff;
		z-index: 2;
		height: 720upx;
		border-radius: 10upx;
		overflow: hidden;

		.title {
			font-size: 36upx;
			padding: 20upx 0;
			text-align: center;
		}

		.editform {
			width: 92%;
			padding-left: 4%;
			padding-right: 4%;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.label {
				width: 20%;
			}

			.inputBox {
				min-height: 50upx;
				width: 80%;
				margin: 10upx;
				border: 1upx solid #eee;
				padding: 10upx;
			}
		}

		.footer {
			background-color: #f8f9fa;
			border-top: 1upx solid #cfcfcf;
			display: flex;
			margin-top:70upx;

			view {
				flex: 1;
				text-align: center;
				height: 80upx;
				line-height: 80upx;
			}

			.confirm {
				color: #8b6945;
				border-left: 1upx solid #cfcfcf;
			}
		}
	}
</style>
