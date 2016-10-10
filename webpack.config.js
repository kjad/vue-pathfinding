var webpack = require('webpack');

module.exports = {
  entry: './src/js/app.js',
  output: {
    filename: './dist/app.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, excludes: /node_modules/, loader: 'buble' },
      { test: /\.css$/, loader: "style!css" }
    ]
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  }
}
