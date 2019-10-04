if (!process.argv[2]) {
  console.error('抱歉！不存在可编译的css文件，请使用 "npm run test:icon [<args>]"来添加编译文件路径')
  return
}
const http = require('http')
const fs = require('fs')
const path = require('path')

const url = process.argv[2]
const outUrl = 'src/assets/styles/dev/component/_fontIcon.less'

http.get('http:' + url, function (response) {
  response.setEncoding('binary') // 二进制binary
  var result = '// out:false, main: ../LayoutSimple.less \r\n'
  result += '// 字体图标，来源路径："' + url + '" \r\n'
  response.on('data', function (data) {
    const delUnnecessary = data.replace(/\.iconfont[\s\S]*?\}/, '')
    const iconCss = delUnnecessary.match(/\.icon\-[\s\S]*?\}/g)
    result += delUnnecessary.replace(/\.icon\-[\s\S]*?\}/g, '')
    for (var i in iconCss) {
      const item = iconCss[i]
      const iconMixin = item.replace(/\.icon\-/, '.AddIcon(').replace(/\:before[\s\S]*?\:/, ',').replace(/\;[\s\S]*?\}/, ')')
      result += iconMixin + ';\r\n'
    }
  })
  response.on('end', function () {
    result += "[class^='@{icon_prefix}'],  [class*='@{icon_prefix}'] { font-family: 'iconfont' !important;} \r\n"
    result = result.replace(/\r{2,}/g, '\r')
    result = result.replace(/\n{2,}/g, '\n')
    fs.writeFile(outUrl, result, function () {
      console.log('\x1B[33m%s\x1B[39m', 'Icon Less 文件创建成功！')
      console.log('\x1B[32m%s\x1B[39m', '请打开文件路径，进行保存，以便less成功被编译 \r\n')
      console.log('\x1B[32m%s\x1B[39m', '[文件路径]'+  path.resolve(outUrl) + '\r\n')
    })
  })
})
