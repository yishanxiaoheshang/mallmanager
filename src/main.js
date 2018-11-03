// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import HttpTool from '@/plugins/http.js'
import ElementUI from 'element-ui'
import moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/index.css'

import router from './router'

Vue.use(HttpTool)
Vue.use(ElementUI)
// 过滤器
Vue.filter('fmtDate',function(v){
  return moment(v).format('YYYY-MM-DD')
})
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
