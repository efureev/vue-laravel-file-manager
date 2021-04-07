import buildRequest from '@feugene/layer-request'
import WrapperInterceptor from '@feugene/request-interceptors/src/response/WrapperInterceptor'
import { ActionInterceptorBuild } from '@feugene/request-interceptors/src/response/ActionInterceptor'

const apiHost = process.env.VUE_APP_API_PREFIX || '/api'

export const createRequest = (store, nameLayer) => {
  const request = buildRequest({ extra: { store } })

  request.manager.addLayer(cm => {
    return cm.new({
      requestConfig: {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
        baseURL: apiHost,
      },
      interceptors: {
        request: [
          // eslint-disable-next-line unicorn/consistent-function-scoping
          () => rConfig => {
            console.info(`\t🌐 ${rConfig.baseURL}${rConfig.url}`)
            return rConfig
          },
        ],
        response: [
          // eslint-disable-next-line unicorn/consistent-function-scoping
          () => response => {
            console.info(`\t✅ ${response.request.responseURL}`)
            return response
          },
          WrapperInterceptor(),
          ActionInterceptorBuild({
            actionAttributeName: 'status',
          }),
        ],
      },
    })
  }, nameLayer)

  return request
}

export default createRequest
