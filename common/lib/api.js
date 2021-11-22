
const base = 'https://devshopapi.wlsphoenix.de/' 			
//const base = 'http://www.wls.com/' 
const urls = class {
	constructor(arg) {
	    
	}
	static m(){
		let baseurl = base
		let test = base+'test'
		let appUpload = base+'appUpload'
		
		let login = base+'appLogin'
		let logout = base+'appLogout'
		let register = base+'appRegister'
		let verify = base+'appVerify'
		let appCodeVerify = base+'appCodeVerify'
		let appPswReset = base+'appPswReset'
		let appPswModify = base+'appPswModify'
		
		let home = base+'appHome'
		let search = base+'appSearch'
		let appSearchList = base+'appSearchList'
				
		let productList = base+'appGoodsList'
		let detail = base+'appGoodsdetail/'
		let category = base+'appCategory'
				
		let keep = base+'appIsKeep'
		let updateKeep = base+'appUpdateKeep'
		let keepGoods = base+'appKeepGoods'
				
		let cart = base+'cart'
		let addCart = base+'addCart'		
		let changeNum = base+'changeNum'
		let delCart = base+'delCart'	
		
		let appAddress = base+'appAddress'
		let addAddress = base+'addAddress'
		let getDefaultAddress = base+'getDefaultAddress'
		let appChangeDefault = base+'appChangeDefault'
		let appGetAddress = base + 'appGetAddress'
		let appDeleteAddress = base + 'appDeleteAddress'
		let appCountryList = base + 'appCountryList'
				
		let addOrder = base+'addOrder'
		let appCancelOrder = base+'appCancelOrder'
		let appOrderList = base+'appOrderList'
		let appPaynow = base+'appPaynow'
		let appPayNotify = base+'appPayNotify'
		let appGetOrder = base+'appGetOrder'
		let appGetOrderDetail = base+'appGetOrderDetail'
		
		let apptestapi = base+'apptestapi'
		
		
		
		return{	
			baseurl,			
			test,
			appUpload,
			
			login,
			logout,
			register,
			verify,
			appCodeVerify,
			appPswReset,
			appPswModify,
			
			home,
			search,
			appSearchList,
			
			productList,
			detail,
			category,
			
			keep,
			updateKeep,
			keepGoods,
			
			cart,
			addCart,	
			changeNum,
			delCart,	
			
			appAddress,
			addAddress,
			getDefaultAddress,
			appChangeDefault,
			appGetAddress,
			appDeleteAddress,
			appCountryList,
			
			addOrder,
			appCancelOrder,
			appOrderList,
			appPaynow,
			appPayNotify,
			appGetOrder,
			appGetOrderDetail,
			
			apptestapi
			
		
		}
	}	
}
export default urls

