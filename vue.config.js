const path = require('path')

function resolve(directory) {
  return path.join(__dirname, directory)
}

module.exports = {
  lintOnSave: process.env.NODE_ENV === 'development',
  runtimeCompiler: true,
  // transpileDependencies: ['element-tiptap', '@wtfcode/vue-merge'],
  transpileDependencies: ['@feugene/request'],
  devServer: {
    open: true,
    proxy: {
      '/api/*': {
        // target: 'https://mil.test.sitesoft.ru',
        target: 'https://hub.ss',
        secure: false,
        changeOrigin: true,
        proxyTimeout: 600000,
        headers: {
          'X-Debug': 'spa',
        },
      },
    },
  },

  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    optimization: {
      splitChunks: false,
    },
  },
}
