import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
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

fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
