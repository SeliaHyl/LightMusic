import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import 'babel-polyfill'
import 'common/stylus/index.styl'
import LazyLoad from 'vue-lazyload'
import Http from 'api/http'
//把http挂载到vue实例上
Vue.prototype.$Http = Http

Vue.config.productionTip = false
Vue.use(LazyLoad, {
	loading: require('common/image/logo.png'),
	error: require('common/image/error.png')
})

Vue.use(MintUI)
fastclick.attach(document.body)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
