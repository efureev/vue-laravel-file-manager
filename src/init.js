import store from './store'
import FileManager from './FileManager.vue'

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

  if (!Vue.prototype.$request) {
    console.error('Please provide a request!')
    return
  }

  Vue.component('file-manager', FileManager)

  options.store.registerModule('fm', store)
}
