import EventBus from '@/eventBus'

const ResponseNoticeInterceptor = options => [
  null,
  error => {
    const message = {
      status: error.type || 'error',
      message: options.store.getters['fm/translate'](error.message),
    }

    // show notification
    EventBus.$emit('addNotification', message)

    options.store.commit('fm/messages/setActionResult', { status: 'warning', message: error.message })

    return Promise.reject(error)
  },
]

export default ResponseNoticeInterceptor
