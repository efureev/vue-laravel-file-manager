import Vue from 'vue'

export default {
  /**
   * Set config
   * @param state
   * @param {{}} data
   */
  customSettings(state, data) {
    /*  if (data.baseURL) {
     state.baseURL = data.baseURL
     }*/

    // overwrite request headers
    if (data.headers) {
      state.headers = data.headers
    }

    if (data.windowsConfig) {
      state.windowsConfig = data.windowsConfig
    }

    if (data.lang) {
      state.lang = data.lang
    }
    if (data.translation) {
      Vue.set(state.translations, data.translation.name, Object.freeze(data.translation.content))
    }
  },

  /**
   * Initiate Axios baseURL and headers
   * @param state
   */
  /*initAxiosSettings(state) {
   const config = request().wrapper.config

   if (!state.baseURL) {
   state.baseURL = config.baseURL
   }

   if (!state.headers) {
   state.headers = config.headers
   }
   },*/

  /**
   * Initialize App settings from server
   * @param state
   * @param data
   */
  initSettings(state, data) {
    if (!state.lang) {
      state.lang = data.lang
    }

    if (!state.windowsConfig) {
      state.windowsConfig = data.windowsConfig
    }

    // state.acl = data.acl
    state.hiddenFiles = data.hiddenFiles
  },

  /**
   * Set Hide or Show hidden files
   * @param state
   */
  toggleHiddenFiles(state) {
    state.hiddenFiles = !state.hiddenFiles
  },
}
