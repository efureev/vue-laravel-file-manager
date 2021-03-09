import EventBus from '@/eventBus'

export const LoadingRequestInterceptor = options => [
  config => {
    console.log('LoadingRequestInterceptor')
    options.store.commit('fm/messages/addLoading')
    return config
  },
  error => {
    // loading spinner -
    options.store.commit('fm/messages/subtractLoading')
    return Promise.reject(error)
  },
]

export const LoadingResponseInterceptor = options => [
  response => {
    options.store.commit('fm/messages/subtractLoading')

    if (response.message) {
      const message = {
        status: response.extra('status') || 'success',
        message: options.store.getters['fm/translate'](response.message),
      }

      // show notification
      EventBus.$emit('addNotification', message)

      // set action result
      this.$store.commit('fm/messages/setActionResult', message)
    }

    return response
  },
  error => {
    // loading spinner -
    options.store.commit('fm/messages/subtractLoading')
    return Promise.reject(error)
  },
]
