<template>
	<view>
		<view class="content">
			<view class="row">
				<view class="nominal">收件人姓名</view>
				<view class="input">
					<input placeholder="请输入收件人姓名" type="text" v-model="consignee" />
				</view>
			</view>
			<view class="row">
				<view class="nominal">邮箱</view>
				<view class="input">
					<input placeholder="请输入收件人邮箱" type="text" v-model="email" />
				</view>
			</view>
			<view class="row">
				<view class="nominal">手机号码</view>
				<view class="input">
					<input placeholder="请输入收件人手机号码" type="text" v-model="tel" />
				</view>
			</view>

			<view class="row">
				<view class="nominal">邮编</view>
				<view class="input">
					<input placeholder="请输入PLZ" type="text" v-model="postcode" />
				</view>
			</view>
			<view class="row">
				<view class="nominal">所在城市</view>
				<view class="input">
					<input placeholder="请输入城市" type="text" v-model="city" />
				</view>
			</view>
			<view class="row">
				<view class="nominal">街道名</view>
				<view class="input">
					<input placeholder="请输入街道名" type="text" v-model="street" />
				</view>
			</view>
			<view class="row">
				<view class="nominal">房屋号</view>
				<view class="input">
					<input placeholder="请输入房屋号" type="text" v-model="house_number" />
				</view>
			</view>
			<view class="row">
				<view class="nominal">国家</view>
				<view class="input">
					<picker @change="bindPickerChange" :value="index" :range="countryList" range-key="name_cn">
						<view v-if="countryList.length > 0">
							{{countryList[index].name_cn}}
						</view>
					</picker>

				</view>
			</view>
		</view>
		<view class="save" @tap="save">
			<view class="btn">保存地址</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				address_id: 0,
				user_id: '',
				consignee: '',
				tel: '',
				email: '',
				country: 'DE',
				city: '',
				postcode: '',
				street: '',
				house_number: '',
				editType: 'edit',
				country_code: 'DE',
				index: 7,
				countryList: [],
			}
		},

		computed: {
			...mapState({
				userInfo: state => state.user.userInfo,
			}),

		},
		onLoad(e) {
			this.getCountryList()
			this.editType = e.type
			if (this.editType == 'edit') {
				uni.setNavigationBarTitle({
					title: '编辑地址'
				})
				this.address_id = e.address_id
				//this.getEditAddress()
			} else {
				uni.setNavigationBarTitle({
					title: '新增地址'
				})
				//this.initAdd()
			}

		},
		methods: {
			getCountryList() {
				this.$H.get(this.$A.m().appCountryList).then(res => {
					this.countryList = res						
					if (this.editType == 'edit') {
						this.getEditAddress()
					} else {
						this.initAdd()
					}
				})
			},
			bindPickerChange: function(e) {
				this.index = e.detail.value
				this.country = this.countryList[this.index].code				
			},
			initAdd() {
				this.user_id = this.userInfo.id
				this.consignee = this.userInfo.username
				this.email = this.userInfo.email				
				this.city = this.userInfo.city
				this.index = this.countryList.findIndex((item) => item.code == 'DE')
			},


			initEdit(res) {
				this.user_id = res.user_id
				this.consignee = res.consignee
				this.email = res.email
				this.tel = res.tel
				this.country = res.country
				this.city = res.city
				this.postcode = res.postcode
				this.street = res.street
				this.house_number = res.house_number
				this.index = this.countryList.findIndex((item) => item.code == res.country)
			},

			//appAddress
			getEditAddress() {
				this.$H.get(this.$A.m().appGetAddress, {
					id: this.address_id
				}, {
					token: true
				}).then(res => {
					this.initEdit(res)
				})
			},


			save() {
				if (!this.consignee) {
					uni.showToast({
						title: '请输入收件人姓名',
						icon: 'none'
					});
					return;
				}
				if (!this.tel) {
					uni.showToast({
						title: '请输入收件人电话号码',
						icon: 'none'
					});
					return;
				}
				if (!this.city) {
					uni.showToast({
						title: '请输入收件人所在城市',
						icon: 'none'
					});
					return;
				}
				if (!this.postcode) {
					uni.showToast({
						title: '请输入邮编',
						icon: 'none'
					});
					return;
				}
				if (!this.street) {
					uni.showToast({
						title: '请输入街道名',
						icon: 'none'
					});
					return;
				}
				if (!this.house_number) {
					uni.showToast({
						title: '请输入房屋号',
						icon: 'none'
					});
					return;
				}

				let data = {
					user_id: this.userInfo.id,
					consignee: this.consignee,
					tel: this.tel,
					email: this.email,
					country: this.country,
					city: this.city,
					postcode: this.postcode,
					street: this.street,
					house_number: this.house_number,
				}

				if (this.editType == 'edit') {
					this.$set(data, 'adress_id', this.address_id)
				}

				this.$H.post(this.$A.m().addAddress, data, {
					token: true
				}).then(res => {
					uni.$emit('updateAddress')
					uni.$emit('updateCart')
					if (this.editType == 'cart') {
						uni.navigateTo({
							url: '/pages/order/confirmation'
						})
					} else {
						uni.navigateBack();
					}
				})

			}
		},

	};
</script>
<style lang="scss">
	page {
		background-color: #f3f3f3;
	}

	.save {
		view {
			display: flex;
		}

		position: fixed;
		bottom: 30upx;
		width: 100%;
		height: 120upx;
		display: flex;
		justify-content: center;
		align-items: center;

		.btn {
			width: 90%;
			height: 80upx;
			border: 1upx solid #8b6945;
			border-radius: 10upx;
			text-align: center;
			color: #8b6945;
			justify-content: center;
			align-items: center;

			.icon {
				height: 80upx;
				color: #fff;
				font-size: 30upx;
				justify-content: center;
				align-items: center;
			}

			font-size: 30upx;
		}
	}

	.content {
		display: flex;
		flex-wrap: wrap;

		view {
			display: flex;
		}

		.row {
			width: 100%;
			padding: 0 3%;
			border-top: solid 1upx #eee;
			border: solid 1upx #eee;
			background-color: #fff;
			align-items: center;

			&.list {
				margin-top: 20upx;
			}

			&.deletBtn {
				width: 100%;
				padding: 0;
			}

			.nominal {
				width: 25%;
				height: 100upx;
				font-weight: 200;
				font-size: 30upx;
				align-items: center;
			}

			.input {
				width: 75%;
				padding: 10upx 0;
				align-items: center;
				font-size: 20upx;

				input {
					width: 100%;
				}
			}

			.del {
				width: 100%;
				height: 100upx;
				justify-content: center;
				align-items: center;
				font-size: 36upx;
				color: #f13033;
				background-color: rgba(255, 0, 0, 0.05);
				background-color: #fff;
				border-bottom: solid 1upx #eee;
			}
		}
	}
</style>
