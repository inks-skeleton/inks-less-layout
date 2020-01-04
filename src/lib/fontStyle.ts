import { LSConfig } from './config'

class CreateFontStyle {
  resultCss: string
  constructor(options: LSConfig) {
    let pcFontSize
    let pcBatchSet
    if (options.pc) {
      pcFontSize = options.pc.fontSize
      pcBatchSet = Object.assign({}, options.pc.batchFontSize, {
        qty: options.batchFontSizeQty,
        unit: 'px'
      })
    }

    let mobileFitRange
    let mobileFontSize
    let mobileBatchSet
    if (options.mobile) {
      mobileFitRange = options.mobile.fitRange[1]
      mobileFontSize = options.mobile.fontSize
      mobileBatchSet = Object.assign({}, options.mobile.batchFontSize, {
        qty: options.batchFontSizeQty,
        unit: '/@rem'
      })
    }

    this.resultCss = ''
    if (pcFontSize && pcBatchSet) {
      this.cteFs(pcFontSize, pcBatchSet)
      if (mobileFontSize && mobileFitRange && mobileBatchSet) {
        this.resultCss += `@media (max-width:${mobileFitRange}px) {\r\n`
        this.cteFs(mobileFontSize, mobileBatchSet)
        this.resultCss += '}\r\n'
      }
    } else if (mobileFontSize && mobileFitRange && mobileBatchSet) {
      this.cteFs(mobileFontSize, mobileBatchSet)
    }
  }
  cteFs(
    defs: number,
    batch: { unit: string; qty: number; start: number; increase: number }
  ): void {
    this.resultCss += `.txt-default{font-size:${defs}${batch.unit};}\r\n`
    if (batch) {
      for (let i = 0; i < batch.qty; i++) {
        const fs = batch.start + i * batch.increase
        this.resultCss += `.txt-fs${i + 1}{font-size:${fs}${batch.unit};}\r\n`
      }
    }
  }
}

export default CreateFontStyle
