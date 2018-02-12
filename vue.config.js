module.exports = {
  lintOnSave: true,
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.md$/,
          loader: './string-loader'
        }
      ]
    }
  }
}