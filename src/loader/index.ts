import loaderUtils from 'loader-utils'
import webpack from 'webpack'
import pcToMobile from '../lib/pc2Mobile'

function loaderApi(this: webpack.loader.LoaderContext, contents: string) {
  const callback: webpack.loader.loaderCallback | undefined = this.async()
  const options = loaderUtils.getOptions(this)

  // 处理需要pc转换mobile的less代码
  const dealUnitRes: string = pcToMobile(
    contents,
    options.pc2Mobile,
    options.mobile?.fitRange
  )
  const lessPath: string = options.lessPath
  this.addDependency(lessPath)

  let importLS: string = ''
  if (options.lessVar && lessPath) {
    importLS = '@import (reference) "' + lessPath + '";\r\n'
  }
  if (callback) callback(null, importLS + dealUnitRes)
}

module.exports = loaderApi
