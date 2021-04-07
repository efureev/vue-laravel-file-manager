import EventBus from '../eventBus'

export const LoadingRequestInterceptor = (options, extra) => [
  config => {
    // console.log('LoadingRequestInterceptor')
    // console.log(extra)
    extra.store.commit('fm/messages/addLoading')
    return config
  },
  error => {
    // loading spinner -
    extra.store.commit('fm/messages/subtractLoading')
    return Promise.reject(error)
  },
]

export const LoadingResponseInterceptor = (options, extra) => [
  response => {
    extra.store.commit('fm/messages/subtractLoading')

    if (response.message) {
      const message = {
        status: response.extra('status') || 'success',
        message: extra.store.getters['fm/translate'](response.message),
      }

      // show notification
      EventBus().$emit('addNotification', message)

      // set action result
      extra.store.commit('fm/messages/setActionResult', message)
    }

    return response
  },
  error => {
    // loading spinner -
    extra.store.commit('fm/messages/subtractLoading')
    return Promise.reject(error)
  },
]
