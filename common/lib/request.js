import $store from '@/store/index.js'
export default {
	// 全局配置
	common:{
		header:{
			'Content-Type':'application/json;charset=UTF-8',
		},
		data:{},
		method:'GET',
		dataType:'json'
	},
	// 请求 返回promise
	request(options = {}){
		// 组织参数
		options.url =  options.url
		options.header = options.header || this.common.header
		options.data = options.data || this.common.data
		options.method = options.method || this.common.method
		options.dataType = options.dataType || this.common.dataType
		
		// token
		if (options.token) {
			options.header.token = $store.state.user.token
		}
		
		// 请求
		return new Promise((res,rej)=>{
			// 请求之前... todo
			// 请求中...
			uni.request({
				...options,
				success: (result) => {					
					// 返回原始数据
					if(options.native){
						return res(result)
					}
					if(result.data.code != 200){
						uni.showToast({
							title: result.data.msg,
							icon: 'none'
						});
						return rej( result.data.data) 
					}
					
					// 服务端失败
					if(result.statusCode !== 200){
						uni.showToast({
							title:'服务端失败',
							icon: 'none'
						});						
						return rej( result.data.data) 
					}
					// 成功
					let data = result.data.data
					res(data)
				},
				fail: (error) => {
					uni.showToast({
						title: error.errMsg || '请求失败',
						icon: 'none'
					});
					return rej()
				}
			});
		})
	},
	// get请求
	get(url,data = {},options = {}){
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	},
	// post请求
	post(url,data = {},options = {}){
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	},
	// delete请求
	del(url,data = {},options = {}){
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	},
}