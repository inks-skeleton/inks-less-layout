import { LSGridLayout } from './config'

class CreateGridLayout {
  resultCss: string
  constructor(options: LSGridLayout.Main) {
    options = options || {}
    const screenSize = options.screenSize
    const gridNum = options.gridNum
    this.resultCss = ''

    // 初始化
    this.resultCss += '.row {margin: 0 auto; font-size: 0; @css_box();}\r\n'
    this.resultCss += '.row::after {content: ""; @css_clearfixAll();}\r\n'
    this.resultCss += '.row [class*= "col"] {@css_ibt();}\r\n'
    this.resultCss += '.hidden{display: none;}\r\n'
    this.resultCss += '.visible{display: block;}\r\n'
    this.resultCss += '.visible-ib{display: inline-block;}\r\n'
    this.resultCss += '.visible-il{display: inline;}\r\n'

    // 生成.col-x
    for (var i = 1; i <= gridNum; i++) {
      this.cteGridCss(i, gridNum)
    }

    // 生成 @media .col-[media name]-x
    this.cteMediaCss(screenSize, gridNum)
  }
  cteGridCss(i: number, total: number, name?: string): void {
    const width = Math.round((100 / total) * i) + '%'
    const css = `{width: ${width};}\r\n`
    this.resultCss += '.row '
    this.resultCss += name ? `.col-${name}-${i}${css}` : `.col-${i}${css}`
  }
  cteMediaCss(screenSize: LSGridLayout.ScreenSize, gridNum: number): void {
    Object.keys(screenSize).forEach(k => {
      const val = Reflect.get(screenSize, k)
      this.resultCss += `@media (max-width:${val}px) {\r\n`
      this.resultCss += `.hidden-${k}{display: none;}\r\n`
      this.resultCss += `.visible-${k}{display: block;}\r\n`
      this.resultCss += `.visible-ib-${k}{display: inline-block;}\r\n`
      this.resultCss += `.visible-il-${k}{display: inline;}\r\n`
      for (var i = 1; i <= gridNum; i++) {
        this.cteGridCss(i, gridNum, k)
      }
      this.resultCss += '}\r\n'
    })
  }
}

export default CreateGridLayout
