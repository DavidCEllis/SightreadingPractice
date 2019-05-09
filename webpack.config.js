const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
      filename: 'dist/index.html',
      template: 'src/index.html',
      inject: 'body'
    })
  ],
  mode: 'production',
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, 'dist/static')
  }
}
