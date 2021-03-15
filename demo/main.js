import Vue from 'vue'
import Vuex from 'vuex'
import FileManager from '@/init'
import request from './request'
import App from './App'
import setBrowserHelpers from './browser.helpers'

Vue.use(Vuex)

// create new store
const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
})

Vue.config.productionTip = process.env.NODE_ENV === 'production'

Vue.prototype.$request = request(store)

Vue.use(FileManager, { store })
setBrowserHelpers()

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
