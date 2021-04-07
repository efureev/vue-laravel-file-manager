import { LoadingRequestInterceptor, LoadingResponseInterceptor } from './LoadingInterceptor'
import ResponseNoticeInterceptor from './ResponseNoticeInterceptor'

const fmApiPath = process.env.VUE_APP_LFM_PATH || 'file-manager'
const isCSRF = process.env.VUE_APP_LFM_CSRF_TOKEN
/*
 const wrapRequest = axiosInstance => {
 return axiosInstance.reconfigure(
 /!**
 * @param {Request} instance
 *!/
 instance => {
 instance.config.baseURL += `/${fmApiPath}`

 if (isCSRF !== 'OFF') {
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
 }*/

let instance

export function setRequest(inst) {
  instance = inst

  const layoutFM = instance.manager.addCopyFrom(
    instance.baseLayerForFM,
    targetConfig => {
      targetConfig.requestConfig.baseURL += `/${fmApiPath}`
      targetConfig.interceptors.request.push(LoadingRequestInterceptor)
      targetConfig.interceptors.response.push(LoadingResponseInterceptor)
      targetConfig.interceptors.response.push(ResponseNoticeInterceptor)

      /*if (isCSRF !== 'OFF') {
       // Laravel CSRF token
       const token = document.head.querySelector('meta[name="csrf-token"]')

       if (!token) {
       console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token')
       } else {
       instance.config.headers['X-CSRF-TOKEN'] = token.content
       }
       }*/
    },
    'fm'
  )
}

const request = (nameConfig = 'fm') => {
  return instance.build(nameConfig)
}

export default request

export { instance }
