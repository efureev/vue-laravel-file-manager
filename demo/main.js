import Vue from 'vue'
import Vuex from 'vuex'
import FileManager from '@/init'
import buildRequest from './request'
import App from './App'
import setBrowserHelpers from './browser.helpers'

Vue.use(Vuex)

// create new store
const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
})

Vue.config.productionTip = process.env.NODE_ENV === 'production'

const request = buildRequest(store, 'api')
request.baseLayerForFM = 'api'

// Vue.prototype.$request = request(store, 'api')
// Vue.prototype.$request.baseLayerForFM = 'api'
// console.log(Vue.prototype.$request)

Vue.use(FileManager, { store, request })
setBrowserHelpers()

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
