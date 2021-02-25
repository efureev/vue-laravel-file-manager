const AuthInterceptor = (options) =>
  (config) => {
    if (options.auth) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = options.auth
    } else {
      // eslint-disable-next-line no-param-reassign
      delete config.headers.Authorization
    }
  }

export default AuthInterceptor
