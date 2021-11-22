import Vue from 'vue'
import App from './App'



// 引入全局组件
import divider from "@/components/common/divider.vue"
Vue.component('divider',divider)


// 引入request库
import $H from '@/common/lib/request.js';
Vue.prototype.$H = $H

import $A from '@/common/lib/api.js'
Vue.prototype.$A = $A

// 助手函数
import $U from './common/lib/util.js';
Vue.prototype.$U = $U

import store from "./store"
Vue.prototype.$store = store


Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  store,
    ...App
})
app.$mount()
