import { LSConfig, LSClient } from './config'

class CreateLayoutStyle {
  resultCss: string
  constructor(options: LSConfig) {
    const minWidth = options.webPage.minWidth
    const maxWidth = options.webPage.maxWidth

    let mainContentWidth, pcElSpace
    if (options.pc) {
      mainContentWidth = options.pc.mainContentWidth
      pcElSpace = options.pc.elSpace
    }

    let mobileFitRange, mobileElSpace
    if (options.mobile) {
      mobileFitRange = options.mobile.fitRange[1]
      mobileElSpace = options.mobile.elSpace
    }

    this.resultCss = ''
    if (minWidth && maxWidth) {
      this.resultCss += `.ly-cen-wrap{margin:0 auto;width:100%;min-width:${minWidth};max-width:${maxWidth};}\r\n`
    }
    if (mainContentWidth) {
      this.resultCss = `.container{box-sizing:border-box;margin:0 auto;width:${mainContentWidth};}\r\n`
    }

    if (pcElSpace && pcElSpace.length > 0) {
      this.cteElSpace(pcElSpace, 'px')
      if (mobileElSpace && mobileElSpace.length > 0 && mobileFitRange) {
        this.resultCss += `@media (max-width:${mobileFitRange}px) {\r\n`
        this.cteElSpace(mobileElSpace, '/@rem', true)
        this.resultCss += '}\r\n'
      }
    } else if (mobileElSpace && mobileElSpace.length > 0 && mobileFitRange) {
      this.cteElSpace(mobileElSpace, '/@rem')
    }
  }
  cteElSpace(
    space: (number | LSClient.ElSpace)[],
    unit: string,
    isFit?: boolean
  ): void {
    space.forEach((s, i) => {
      let name = `h${i + 1}`
      const startCss = isFit
        ? `.ly-space-${name}{`
        : `.ly-space-${name}{width:100%;`

      if (typeof s === 'object') {
        if (s.name) name = s.name
        this.resultCss += startCss + `height:${s.space + unit};`
        if (s.color) this.resultCss += `background-color:${s.color};`
        this.resultCss += '}\r\n'
      } else {
        this.resultCss += startCss + `height:${s + unit};}\r\n`
      }
    })
  }
}

export default CreateLayoutStyle
