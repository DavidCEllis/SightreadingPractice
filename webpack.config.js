const path = require('path')

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          // 'style-loader',
          // 'css-loader',
          'babel-loader'
        ],
        exclude: /node_modules/
      }
    ]
  },
  mode: 'development',
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, 'dist/static')
  }
}
