import { LSConfig, LSWebPage } from './config'

class CreateInitStyle {
  resultCss: string
  lessVar: string
  constructor(options: LSConfig) {
    options = options || {}
    const webPage = options.webPage
    const pcFontSize = options.pc && options.pc.fontSize
    const mobileFontSize = options.mobile && options.mobile.fontSize
    const htmlFontSize = options.mobile && options.mobile.htmlFontSize
    const mobileFitRange = (options.mobile && options.mobile.fitRange) || []
    const mobileFitRangeMax = mobileFitRange.length >= 1 ? mobileFitRange[1] : 0
    const pcFontSizeCss = pcFontSize ? `font-size:${pcFontSize};` : ''

    this.resultCss = ''
    this.lessVar = ''

    // 网页字体配置
    const ffMixin = ['hei', 'kai', 'song', 'fangsong'].some(
      s => s === webPage.fontFamily
    )
    if (ffMixin) webPage.fontFamily = '@fonts_css_' + webPage.fontFamily + '();'

    // 页面html根字体配置
    if (mobileFontSize) this.lessVar = `@rem:${htmlFontSize}rem;\r\n`

    this.resultCss +=
      'body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,button,textarea,p,blockquote,th,td{margin:0; padding:0; border:0;}\r\n'
    this.resultCss += `body,a,button,input,select,textarea,td,th,caption{${pcFontSizeCss}${webPage.fontFamily}color:${webPage.fontColor};}\r\n`
    this.resultCss +=
      'input[type="button"],input[type="submit"],button,select,a{cursor:pointer;}\r\n'
    this.resultCss += 'html{overflow-y:scroll;}\r\n'
    this.resultCss += 'ol,ul,li{list-style:none;}\r\n'

    if (webPage.stockFWNormal) {
      this.resultCss +=
        'h1,h2,h3,h4,h5,h6,address,caption,cite,code,dfn,em,strong,th,var{font-weight:normal;}\r\n'
    }
    if (webPage.background) {
      this.resultCss += `body{background:${webPage.background};}\r\n`
    }
    if (webPage.delAUnderline) {
      this.resultCss += 'a{text-decoration:none;}\r\n'
    }
    if (webPage.iosTransparent) {
      this.resultCss +=
        'input,button,select,textarea,a{-webkit-tap-highlight-color:rgba(0,0,0,0);}\r\n'
    }
    if (webPage.delBtnDefCss) {
      this.resultCss +=
        'input,button,select,textarea{outline:none;background:none;-webkit-appearance:none;}\r\n'
    }
    if (webPage.iosBtnOpacity) {
      this.resultCss += `input:disabled{-webkit-opacity:${webPage.iosBtnOpacity};}\r\n`
    }

    this.ctePageWH(webPage)
    if (pcFontSize) {
      this.cteDefFs(webPage, pcFontSize + 'px', true)
      if (mobileFontSize && mobileFitRangeMax) {
        this.resultCss += `@media (max-width:${mobileFitRangeMax}px) {\r\n`
        this.resultCss += `html{font-size:${htmlFontSize}px;}\r\n`
        this.cteDefFs(webPage, mobileFontSize + '/@rem')
        this.resultCss += '}\r\n'
      }
    } else if (mobileFontSize && mobileFitRangeMax) {
      this.resultCss += `html{fontsize:${htmlFontSize}px;}\r\n`
      this.cteDefFs(webPage, mobileFontSize + '/@rem', true)
    }
  }
  ctePageWH(webPage: LSWebPage): void {
    this.resultCss += `body,html{`
    if (webPage.width) this.resultCss += `width:${webPage.width};`
    if (webPage.minWidth) this.resultCss += `min-width:${webPage.minWidth};`
    if (webPage.maxWidth) this.resultCss += `max-width:${webPage.maxWidth};`
    if (webPage.height) this.resultCss += `height:${webPage.height};`
    this.resultCss += '}\r\n'
  }
  cteDefFs(webPage: LSWebPage, fs: string, init?: boolean): void {
    this.resultCss += 'body,a,button,input,select,textarea,td,th,caption{'
    this.resultCss += `font-size:${fs};`
    if (init)
      this.resultCss += `${webPage.fontFamily}color:${webPage.fontColor};`
    this.resultCss += '}\r\n'
  }
}

export default CreateInitStyle
