const extendedModuleToCdn = require('./src/util.js').extendedModuleToCdn

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const DynamicCdnWebpackPlugin = require('dynamic-cdn-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  entry: ['./src/index.js'],
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
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NOTE_ENV === 'development'
            }
          },
          'css-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: process.env.NOTE_ENV === 'development'
          }
        }, {
          loader: 'css-loader', // translates CSS into CommonJS modules
        }, {
          loader: 'postcss-loader', // Run postcss actions
          options: {
            plugins: function () { // postcss plugins, can be exported to postcss.config.js
              return [
                require('autoprefixer')
              ]
            }
          }
        }, {
          loader: 'sass-loader' // compiles Sass to CSS
        }]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin([
      { from: './src/note_detection/audio_input/model', to: './static/model'}
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: 'body'
    }),
    new DynamicCdnWebpackPlugin({ resolver: extendedModuleToCdn }),
    new MiniCssExtractPlugin()
  ],
  mode: 'production',
  output: {
    filename: 'static/[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
}
