import $A from '@/common/lib/api.js'
import $H from '@/common/lib/request.js';
import $U from '@/common/lib/util.js';
import $store from '@/store/index.js'
export default {
	state: {
		cartlist: [],
		addressList: [],
		default_delivery: null,
		default_bill: null,
		addressChecked: true,
	},
	getters: {
		checkedAll: (state) => {
			let check = true
			state.cartlist.forEach(v1 => {
				v1.list.forEach(v2 => {
					if (v2.is_selected == 0) {
							check = false
						}
					}
				)
			})
			return check
		},
		totalPrice: (state) => {
			let total = 0
			state.cartlist.forEach(v1 => {
				v1.list.forEach(v2 => {
					if (v2.is_selected == 1) {
							total += v2.sku.price_1 * v2.amount
						}
					}
				)
			})
			return total.toFixed(2)
		},

		selectSum: (state) => {
			let count = 0
			state.cartlist.forEach(v1 => {
				v1.list.forEach(v2 => {
					if (v2.is_selected == 1) {
							count += v2.amount
						}
					}
				)
			})
			return count
		},

		orderlist: (state) => {
			let orderlist = []
			state.cartlist.forEach((v1, index1) => {
				let list = []
				let cartId = []
				let totalPrice = 0
				let totalAmount = 0
				v1.list.forEach((v2, index2) => {
					if (v2.is_selected == 1) {
						list.push(v2)
						cartId.push(v2.id)
						totalAmount = totalAmount + v2.amount
						totalPrice = totalPrice + v2.sku.price_1 * v2.amount
					}
				})
				if (list.length > 0) {
					let order = {
						type: v1.delivery_type,
						type_label: v1.delivery_type_label,
						user_note: '',
						totalAmount: totalAmount,
						totalPrice: totalPrice.toFixed(2),
						delivery_address: v1.delivery_address,
						bill_address: v1.bill_address,
						cartId: cartId,
						list: list,
					}
					orderlist.push(order)
				}
			})
			return orderlist
		},
	},
	mutations: {
		initAddressList(state, list) {
			state.addressList = list
			state.addressList.forEach(v => {
				if (v.is_default_delivery == 1) {
					state.default_delivery = v
				}
				if (v.is_default_bill == 1) {
					state.default_bill = v
				}
			})
		},

		
		addCartList(state, cart) {
			let exit = false
			let array = []
			state.cartlist.forEach(v1 => {
				if(v1.delivery_type == cart.delivery_type){				
					v1.list.forEach(v2 => {
						array.push(v2)
						if (v2.id == cart.id) {
								v2.amount = cart.amount	
								exit = true
							}
						}													
					)
					if(!exit){
						array.push(cart)
						v1.list = array
					}										
				}				
			})
		},
		
		initCartList(state, list) {
			let cartList = []
			list.forEach(item => {
				let cart = {
					delivery_type: item.delivery_type,
					delivery_type_label: item.delivery_type_label,
					delivery_address: state.default_delivery,
					bill_address: state.default_bill,
					list: item.list
				}
				cartList.push(cart)
			})
			state.cartlist = cartList
			//console.log(JSON.stringify(state.cartlist))
		},

		updateBadge(state) {
			let count = 0
			state.cartlist.forEach(v1 => {
				v1.list.forEach(v2 => {
					count += v2.amount
				})
			})
			console.log(count)
			$U.updateCartBadge(count)
		},

		selectItem(state, id) {
			state.cartlist.forEach(v1 => {
				v1.list.forEach(v2 => {
						if (v2.id == id) {
							v2.is_selected = 1 - v2.is_selected
						}
					}
				)
			})									
		},
		// 全选
		selectAll(state) {
			state.cartlist.forEach(v1 => {
				v1.list.forEach(v2 => {
						v2.is_selected = 1
					}
				)
			})
		},
		// 取消全选
		unSelectAll(state) {
			state.cartlist.forEach(v1 => {
				v1.list.forEach(v2 => {
						v2.is_selected = 0
					}
				)
			})
		},
		// 删除选中
		delCart(state, id) {
			$U.updateCartBadge(count)
		},

		selectAddress(state, t) {
			//row.id + '-' + delivery_type + '-' +address_type
			let array = t.split('-')
			// console.log(JSON.stringify(array))
			let id = array[0]
			let address = null
			state.addressList.forEach(v => {
				if (v.id == array[0]) {
					address = v
				}
			})
			state.cartlist.forEach(v1 => {
				if (v1.delivery_type == array[1]) {
					if (array[2] == 't') {
						v1.delivery_address = address
					} else {
						v1.bill_address = address
					}
				}
			})
			uni.navigateTo({
				url: '../../order/confirmation'
			})
		},


		setAddressDefault(state, id, t) {
			state.addressList.forEach(v => {
				if (t == 't') {
					if (v.id == id) {
						v.is_default_delivery = 1
					} else {
						v.is_default_delivery = 0
					}
				}

				if (t == 'b') {
					if (v.id == id) {
						v.is_default_bill = 1
					} else {
						v.is_default_bill = 0
					}
				}
			})
		},

		checkAddress(state, address) {
			let msg = ''
			let check = true
			if (address.is_default_delivery == 1 || address.is_default_bill == 1) {
				msg = '默认的地址不可以编辑或删除'
				check = false
			}
			if (address.is_used) {
				msg = '地址已经在订单里使用， 不可以更改或删除'
				check = false
			}

			state.cartlist.forEach(v => {
				if (v.delivery_address.id == address.id || v.bill_address.id == address.id) {
					msg = '地址已经在订单里使用， 不可以更改或删除'
					check = false
				}

			})
			if (!check) {
				uni.showToast({
					title: msg,
					icon: 'none'
				});
			}

			state.addressChecked = check
		},
	},
	
	actions: {
		updateAddressList({
			state,
			commit
		}) {
			if ($store.state.user.loginStatus) {
				$H.get($A.m().appAddress, {
					user_id: $store.state.user.userInfo.id,
					time: Date.parse(new Date())
				}, {
					token: true
				}).then(res => {
					commit('initAddressList', res)
				})
			}
		},
		// 更新购物车列表
		updateCartList({
			state,
			commit
		}) {
			if ($store.state.user.loginStatus) {
				$H.get($A.m().cart, {
					user_id: $store.state.user.userInfo.id,
					time: Date.parse(new Date())
				}, {
					token: true
				}).then(res => {
					//console.log(JSON.stringify(res.length))
					commit('initCartList', res)
					commit('updateBadge')
				})
			}
		},


		doSelectAll({
			commit,
			getters
		}) {
			getters.checkedAll ? commit('unSelectAll') : commit('selectAll')
		},

	}
}
