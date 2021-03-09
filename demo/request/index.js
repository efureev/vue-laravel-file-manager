import buildBaseRequest from '@feugene/request'
import { isObject } from '@feugene/mu/src/is'

const baseHost = process.env.VUE_APP_HOST
const apiPrefix = process.env.VUE_APP_API_PREFIX

function initHeaders() {
  return {
    'X-Requested-With': 'XMLHttpRequest',
  }
}

const request = store => (config = {}) => {
  const headers = {
    ...initHeaders(),
    ...(isObject(config.headers) ? config.headers : {}),
  }

  const mergedConfig = {
    baseURL: `${baseHost}${apiPrefix}`,
    ...config,
    headers,
  }

  mergedConfig.store = store

  return buildBaseRequest(mergedConfig)
}

export default request
