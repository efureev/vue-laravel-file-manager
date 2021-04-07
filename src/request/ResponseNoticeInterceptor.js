import EventBus from '../eventBus'

const ResponseNoticeInterceptor = (options, extra) => [
  null,
  error => {
    const message = {
      status: error.type || 'error',
      message: extra.store.getters['fm/translate'](error.message),
    }

    // show notification
    EventBus().$emit('addNotification', message)

    extra.store.commit('fm/messages/setActionResult', { status: 'warning', message: error.message })

    return Promise.reject(error)
  },
]

export default ResponseNoticeInterceptor
