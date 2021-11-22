<script>
	export default {
		onLaunch: function () {
			// 初始化登录状态
			this.$store.commit('initUser')
			this.$store.dispatch('updateAddressList')
		  	this.$store.dispatch('updateCartList')
			uni.$on('updateAddress',()=>{
				this.$store.dispatch('updateAddressList')
			})
			// 监听购物车更新
			uni.$on('updateCart',()=>{
				this.$store.dispatch('updateCartList')
			})	
		
		},
		onShow: function () {
			
		},
		onHide: function () {
			
		}
	}
</script>

<style lang="scss">
	@import "/static/iconfont/font.scss";

	/*每个页面公共css */
	/* #ifndef APP-PLUS-NVUE */
	/* 官方ui库 */
	@import "/common/uni.css";
	/* 第三方动画库 */
//	@import "/common/animate.css";
	/* 自定义图标库 */
//	@import "/common/icon.css";
	/* UI基础库 */
//	@import "/common/zcm-main.css";
	/* #endif */
	/* #ifdef APP-NVUE */
//	@import "/common/zcm-main-nvue.css";
	/* #endif */
	/* 公共样式 */
	//@import "/common/common.css";
</style>
