if (!process.argv[2]) {
  console.error(
    '抱歉！不存在可编译的css文件，请使用 "npm run test:icon [<args>]"来添加编译文件路径'
  )
  return
}
/**
 * 2019.12.3
 * 1. 需要编写为gulp插件，以便build的时候直接打包iconfont文件
 * 单独封为插件后，独立生成一个less文件，然后与主less文件合并
 * 需要找一个合并less的gulp插件配合使用，如果没有则考虑自开发
 *
 * 2. 提取less变量，以便部分开发时使用变量
 */
const path = require('path')
const http = require('http')
const request = require('request')
const fs = require('fs')

const isDev = (process.env.NODE_ENV || '').trim() !== 'production'
const url = process.argv[2]
const urlPrefix = url.replace('.css', '')
const lessOutUrl = path.join(__dirname, 'index.less')
const iconCssUrl = path.join(__dirname, 'iconFontCssUrl.text')

if(!isDev) {
  const fontFileOutUrl =path.join(__dirname, '../../../dist/iconfont/iconfont') // 请确保与默认配置文件中的字体图标路径保持一致
  const fontExtList = ['.eot', '.ttf', '.svg', '.woff', '.woff2']
  fontExtList.forEach(ext => {
    request('http:' + urlPrefix + ext).pipe(fs.createWriteStream(fontFileOutUrl + ext))
  })
}

http.get('http:' + url, function (response) {
  response.setEncoding('binary') // 二进制binary
  var rawData = ''
  response.on('data', function (chunk) {
    rawData += chunk
  })
  response.on('end', function () {
    if(!isDev) rawData = rawData.replace(new RegExp(urlPrefix, 'g'), './iconfont/iconfont')
    var result = '// 字体图标，来源路径："' + url + '" \r\n'
    const delUnnecessary = rawData.replace(/\.iconfont[\s\S]*?\}/, '')
    const iconCss = delUnnecessary.match(/\.icon\-[\s\S]*?\}/g)
    result += delUnnecessary.replace(/\.icon\-[\s\S]*?\}/g, '')
    for (var i in iconCss) {
      const item = iconCss[i]
      const iconMixin = item
        .replace(/\.icon\-/, '.AddIcon(')
        .replace(/\:before[\s\S]*?\:/, ',')
        .replace(/\;[\s\S]*?\}/, ')')
      result += iconMixin + ';\r\n'
    }
    result = result.replace(/\r{2,}/g, '\r')
    result = result.replace(/\n{2,}/g, '\n')
    fs.writeFile(iconCssUrl, url, function () {
      console.log('\x1B[33m%s\x1B[39m', 'Icon Css 来源路径保存成功！')
    })
    fs.writeFile(lessOutUrl, result, function () {
      console.log('\x1B[33m%s\x1B[39m', 'Icon Less 文件创建成功！')
      console.log('\x1B[32m%s\x1B[39m', '[文件路径] ' + lessOutUrl + '\r\n')
    })
  })
})
