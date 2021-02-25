export default {
  /**
   * Base URL
   * @param state
   * @returns {default.baseURL|(function(*))|string|*|string|null}
   */
  /*baseURL(state) {
    return state.baseURL
  },
*/
  /**
   * Headers
   * @param state
   * @return {*}
   */
  headers(state) {
    return state.headers
  },

  /**
   * Headers has Authorization
   * @param state
   * @return {boolean}
   */
  authHeader(state) {
    return Object.prototype.hasOwnProperty.call(state.headers, 'Authorization')
  },

  translateMap(state) {
    return state.translations[state.lang || 'en']
  },
}
