const extendedModuleToCdn = require('./src/util.es6').extendedModuleToCdn
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DynamicCdnWebpackPlugin = require('dynamic-cdn-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: 'body'
    }),
    new DynamicCdnWebpackPlugin({ resolver: extendedModuleToCdn })
  ],
  mode: 'production',
  output: {
    filename: 'static/main.bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}
