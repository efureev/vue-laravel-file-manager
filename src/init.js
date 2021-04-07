import store from './store'
import FileManager from './FileManager.vue'
import { setEventBus } from './eventBus'
import { initPlugins } from './plugins'
import { setRequest } from './request'

/**
 * Install
 *
 * @param Vue
 * @param options
 */
export default function install(Vue, options = {}) {
  if (!options.store) {
    console.error('Please provide a store!')
    return
  }

  /*if (!Vue.prototype.$request) {
   console.error('Please provide a request!')
   return
   }*/

  if (!options.request) {
    console.error('Please provide a request!')
    return
  }

  setEventBus(new Vue())
  setRequest(options.request)
  initPlugins(Vue)

  Vue.component('file-manager', FileManager)

  options.store.registerModule('fm', store)
}
