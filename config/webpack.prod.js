const path = require('path')
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const BuildConfigPlugin = require('./plugin/build.config')
const common = require('./webpack.common.js')

const MODE_TYPE = process.env.MODE_TYPE
const entry = {
  gulp: { index: './src/main_gulp.ts' },
  loader: {
    index: './src/main_loader.ts',
    loaderLess: './src/loader/index.ts'
  }
}
const output = path.resolve(__dirname, '../packages/' + MODE_TYPE)
const externals = BuildConfigPlugin.getDependencies()
const copyFile = BuildConfigPlugin.getCopyFile(output)

module.exports = merge(common, {
  mode: 'production',
  entry: entry[MODE_TYPE],
  externals,
  output: {
    library: 'LayoutSimple',
    libraryTarget: 'umd',
    path: output,
    filename: '[name].js'
  },
  target: 'node',
  plugins: [
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: output }),
    new BuildConfigPlugin(output),
    new CopyWebpackPlugin(copyFile)
  ]
})
