import { LSConfig, LSTheme } from './config'

class CreateTheme {
  public resultCss: string
  public fitMediaCss: string
  public lessVar: string
  constructor(options: LSConfig) {
    // 参数配置
    const pcBorderWidth = options.pc && options.pc.borderWidth
    const mobileBorderWidth = options.mobile && options.mobile.borderWidth
    const mobileFitRange = options.mobile && options.mobile.fitRange[1]
    const themeColor = options.theme && options.theme.color
    const borderRadius = 10

    // 构造函数属性赋值
    this.resultCss = ''
    this.fitMediaCss = ''
    this.lessVar = ''

    if (themeColor) {
      // 生成移动端适配开头
      if (pcBorderWidth && mobileBorderWidth && mobileFitRange) {
        this.fitMediaCss = `@media (max-width:${mobileFitRange}px) {\r\n`
      }

      // 遍历生成主题Less
      Object.keys(themeColor).forEach(k => {
        const val: any = themeColor[k]
        let isValString: boolean = typeof val === 'string'
        let isValObject: boolean = typeof val === 'object'
        const pcUnit: string = 'px'
        const mobileUnit: string = '/@rem'

        if (pcBorderWidth) {
          // 生成pc端主题
          if (isValString) {
            this.cteDefAll(k, val, pcBorderWidth, borderRadius, pcUnit)
          }
          if (isValObject) {
            this.cteCondition(k, val, pcBorderWidth, borderRadius, pcUnit)
          }

          // 生成移动端主题适配
          if (mobileBorderWidth && mobileFitRange) {
            this.cteMediaCss(k, mobileBorderWidth, borderRadius, mobileUnit)
          }
        } else if (mobileBorderWidth && mobileFitRange) {
          // 生成移动端主题
          if (isValString) {
            this.cteDefAll(k, val, mobileBorderWidth, borderRadius, mobileUnit)
          }
          if (isValObject) {
            this.cteCondition(
              k,
              val,
              mobileBorderWidth,
              borderRadius,
              mobileUnit
            )
          }
        }
      })

      // 生成移动端适配结尾
      if (pcBorderWidth && mobileBorderWidth && mobileFitRange) {
        this.fitMediaCss += '}\r\n'
        this.resultCss += this.fitMediaCss
      }
    }
  }
  cteVal(k: string, color: string): void {
    // 变量颜色
    this.lessVar += `@col_${k}:${color};\r\n`
  }
  cteText(k: string, color: string): void {
    // 文字颜色
    this.resultCss += `.col_txt_${k}{color:${color};}\r\n`
  }
  cteBtn(
    k: string,
    color: string,
    type: {
      borderWidth: string
      borderRadius: string
      text: string[]
      calc?: number
    }
  ): void {
    const borderWidth = type.borderWidth
    const borderRadius = type.borderRadius
    const btnTextCol = type.text
    const calcNum = type.calc || '30%'

    // 边线式按钮
    this.resultCss += `.col_btn_${k}-simple{border: ${borderWidth} solid ${color};border-radius:${borderRadius};color:${color};text-align:center;}\r\n`

    // 背景式按钮
    const colorType = ['lighten', 'darken']
    btnTextCol.forEach((c, i) => {
      this.resultCss += `.col_btn_${k}${i +
        1}{background-color:${color};border-radius:${borderRadius};text-align:center;`
      this.resultCss += colorType.some(s => s === c)
        ? `color:${c}(${color},${calcNum});`
        : `color:${c};`
      this.resultCss += '}\r\n'
    })
  }
  cteDefAll(
    k: string,
    color: string,
    borderWidth: number,
    borderRadius: number,
    unit: string
  ): void {
    // 默认创建全部
    this.cteVal(k, color)
    this.cteText(k, color)
    this.cteBtn(k, color, {
      borderWidth: borderWidth + unit,
      borderRadius: borderRadius + unit,
      text: ['#fff']
    })
  }
  cteCondition(
    k: string,
    val: LSTheme.LSThemeColorObject,
    borderWidth: number,
    borderRadius: number,
    unit: string
  ): void {
    // 条件式创建
    this.cteVal(k, val.c)
    if (val.cText) this.cteText(k, val.c)
    if (val.cBtn) {
      const cBtn = val.cBtn
      if (typeof cBtn === 'boolean') {
        this.cteBtn(k, val.c, {
          borderWidth: borderWidth + unit,
          borderRadius: borderRadius + unit,
          text: ['#fff']
        })
      }

      if (typeof cBtn === 'object') {
        this.cteBtn(k, val.c, {
          borderWidth: borderWidth + unit,
          borderRadius: (cBtn.borderRadius || borderRadius) + unit,
          text: cBtn.text && cBtn.text.length > 0 ? cBtn.text : ['#fff'],
          calc: cBtn.calc
        })
      }
    }
  }
  cteMediaCss(
    k: string,
    borderWidth: number,
    borderRadius: number,
    unit: string
  ): void {
    // 创建适配css
    this.fitMediaCss += `.col_btn_${k}-simple{border-width:${borderWidth +
      unit};border-radius:${borderRadius + unit};}\r\n`
  }
}

export default CreateTheme
