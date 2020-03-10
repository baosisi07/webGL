const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.conf')

const devServer = {
  port: 8000,
  host: '127.0.0.1',
  overlay: {
    errors: true
  },
  historyApiFallback: {
    index: '/index.html'
  },
  hot: true
}
let config = merge(baseConfig, {
    mode: 'development',
    devtool: '#cheap-module-eval-source-map',
    module: {
      rules: [
        {
          test: /\.(scss|sass)$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            'sass-loader'
          ]
        },
      ]
    },
    devServer,
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  })

module.exports = config