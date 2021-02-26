import buildBaseRequest from '@feugene/request'
import AuthInterceptor from './interceptors/AuthInterceptor'
import { LoadingRequestInterceptor, LoadingResponseInterceptor } from '@/request/LoadingInterceptor'
import ResponseNoticeInterceptor from '@/request/ResponseNoticeInterceptor'

function initBaseUrl() {
  let baseUrl
  if (process.env.VUE_APP_HOST) {
    baseUrl = process.env.VUE_APP_HOST
  } else {
    baseUrl = `${window.location.protocol}//${window.location.hostname}`

    if (window.location.port.length) {
      baseUrl += `:${window.location.port}`
    }
  }
  baseUrl += `/api/admin/file-manager`

  return baseUrl
}

function initHeaders() {
  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
  }

  // off laravel csrf-token if need
  if (process.env.VUE_APP_LFM_CSRF_TOKEN !== 'OFF') {
    // Laravel CSRF token
    const token = document.head.querySelector('meta[name="csrf-token"]')

    if (!token) {
      console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token')
    } else {
      headers['X-CSRF-TOKEN'] = token.content
    }
  }

  return headers
}

function initSettings() {
  return {
    baseURL: initBaseUrl(),
    headers: initHeaders(),
  }
}

// initiate headers, if not set manually
export const defaultConfig = initSettings()

const request = store => (config = {}) => {
  const mergedConfig = { ...defaultConfig, ...config }

  mergedConfig.store = store
  if (config.auth) {
    mergedConfig.auth = 'secret_token'
  }

  mergedConfig.afterInitFn = instance => {
    instance.registerRequestInterceptors(LoadingRequestInterceptor)
    instance.registerResponseInterceptors(LoadingResponseInterceptor, ResponseNoticeInterceptor)

    if (instance.config.auth) {
      instance.registerRequestInterceptors(AuthInterceptor)
    }

    /*if (isFunction(instance.config.responseWrap)) {
     instance.registerResponseInterceptors(WrapperInterceptor)
     }*/
  }
  /*
   config.responseWrap.fn = (instance) => {
   instance.registerResponseInterceptors(WrapperInterceptor)
   }*/

  return buildBaseRequest(mergedConfig)
}

export default request
