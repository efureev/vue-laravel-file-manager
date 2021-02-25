import Vue from 'vue'

const request = (config) => {
  return Vue.prototype.$request(config)
}

export default request
