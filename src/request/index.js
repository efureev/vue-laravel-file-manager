import Vue from 'vue'
import { LoadingRequestInterceptor, LoadingResponseInterceptor } from '@/request/LoadingInterceptor'
import ResponseNoticeInterceptor from '@/request/ResponseNoticeInterceptor'

const fmApiPath = process.env.VUE_APP_LFM_PATH || 'file-manager'

const wrapRequest = axiosInstance => {
  return axiosInstance.reconfigure(
    /**
     * @param {Request} instance
     */
    instance => {
      instance.config.baseURL += `/${fmApiPath}`

      if (process.env.VUE_APP_LFM_CSRF_TOKEN !== 'OFF') {
        // Laravel CSRF token
        const token = document.head.querySelector('meta[name="csrf-token"]')

        if (!token) {
          console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token')
        } else {
          instance.config.headers['X-CSRF-TOKEN'] = token.content
        }
      }

      instance.registerRequestInterceptors(LoadingRequestInterceptor)
      instance.registerResponseInterceptors(LoadingResponseInterceptor, ResponseNoticeInterceptor)
    }
  )
}

const request = config => {
  return wrapRequest(Vue.prototype.$request(config))
}

export default request
