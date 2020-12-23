const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const dev = process.env.NODE_ENV === 'dev'

let config = {
  mode: dev ? 'development' : 'production',
  watch: false,
  cache: false,
  entry: ['./src/style/index.scss', './src/index.js'],
  output: {
    filename: dev ? '[name].js' : '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/'
  },
  devtool: dev ? 'eval-cheap-module-source-map' : false,
  module: {
    rules: [
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'html-loader'
      },
      {
        test: /\.ejs$/,
        use: {
          loader: 'ejs-compiled-loader',
          options: {
            htmlmin: true,
            htmlminOptions: {
              removeComments: true
            }
          }
        }
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          emitWarning: dev,
          failOnWarning: !dev
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[hash:7].[ext]',
          outputPath: 'assets/files'
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: '[name].[hash:7].[ext]',
              outputPath: './assets/images'
            }
          },
          {
            loader: 'img-loader',
            options: {
              enabled: !dev
            }
          }
        ]
      }
    ]
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'src')],
    extensions: ['.js', '.json', '.jsx', '.css', 'scss'],
    alias: {
      '@': path.resolve(__dirname, 'src/assets/'),
      '@css': path.resolve(__dirname, 'src/style/'),
      '@js': path.resolve(__dirname, 'src/js/')
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: dev ? '[name].css' : '[name].[contenthash].css',
      chunkFilename: dev ? '[id].css' : '[id].[contenthash].css'
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*'], //, '!index.html'
      verbose: true,
      dry: false
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.ejs'
    })
  ],
  optimization: {
    minimize: dev ? false : true
  },
  devServer: {
    publicPath: '/dist',
    port: 8080,
    overlay: true, // display errors
    compress: true
    // proxy: { // api
    //   "/web": {
    //     target: "http://localhost:8000",
    //     pathRewrite: {"^/web" : ""}
    //   }
    // },
    // headers: { // CORS
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    //   "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    // }
  }
}

if (!dev) {
  config.plugins.push(new WebpackManifestPlugin())
}

module.exports = config
