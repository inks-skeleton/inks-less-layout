const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const WebpackLayoutSimpleLoader = require('../packages/loader')
const common = require('./webpack.common.js')

const MODE_TYPE = process.env.MODE_TYPE
const entry = './test/index.js'
const output = path.resolve(__dirname, '../demo/dist_' + MODE_TYPE)
const mode = MODE_TYPE === 'dev' ? 'development' : 'production'

module.exports = () => {
  const lsLoader = new WebpackLayoutSimpleLoader({ entry })
  return new Promise(resolve => {
    lsLoader.loaderOptions().then(lsOptions => {
      const cfg = merge(common, {
        mode,
        entry: entry,
        output: {
          path: output,
          filename: 'index.js'
        },
        module: {
          rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env']
                }
              }
            },
            {
              test: /\.less$/,
              exclude: /node_modules/,
              use: [
                'style-loader',
                'css-loader',
                'less-loader',
                {
                  loader: lsLoader.loaderLess,
                  options: lsOptions
                }
              ]
            }
          ]
        },
        devtool: 'inline-source-map',
        devServer: {
          contentBase: output,
          host: '192.168.123.25',
          port: '8080',
          hot: true,
          open: true
        },
        plugins: [
          new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: output }),
          new HtmlWebpackPlugin({
            title: 'layout simple loader test',
            template: path.join(__dirname, '../test/index.html')
          }),
          new webpack.NamedModulesPlugin(),
          new webpack.HotModuleReplacementPlugin()
        ]
      })
      resolve(cfg)
    })
  })
}
