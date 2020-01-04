import { LSPc2Mobile } from './config'
import { strict } from 'assert'
function pcToMobile(
  contents?: string,
  options?: LSPc2Mobile,
  mobileFitRange?: number[]
): string {
  if (!contents || !options || !mobileFitRange) return ''
  const sign = '$ls'
  const scale = options.scale
  const rowCssReg: RegExp = new RegExp('.[\\s\\S]*?}', 'g') // 匹配出每行的css代码，在去找里面的$ls单位替代符号去替代他的pc单位，并找到其属性名称，生成移动端适配代码
  const attrCssReg: RegExp = new RegExp(
    '[A-z]+:\\s*\\' + sign + '\\(\\d+\\)',
    'g'
  )
  const signReg: RegExp = new RegExp('\\' + sign + '\\(\\d+\\)', 'g')

  let fitMediaCss: string = ''
  let dealRes: string = contents
  const rowCssList = contents.match(rowCssReg)
  if (rowCssList && rowCssList.length > 0) {
    rowCssList.forEach(c => {
      const attrDealUnit = c.match(attrCssReg)
      if (attrDealUnit && attrDealUnit.length > 0) {
        if (fitMediaCss === '') {
          fitMediaCss = `@media (max-width:${mobileFitRange[1]}px) {\r\n`
        }

        attrDealUnit.forEach(a => {
          // 获取属性值
          let val: string = ''
          const valList = a.match(signReg)
          if (valList && valList.length > 0) val = valList[0]

          // 获取属性值单位代替符号中的数字
          let num: string = ''
          const numList = val.match(/\d+/g)
          if (numList && numList.length > 0) num = numList[0]

          // PC端px单位处理
          if (val && num) dealRes = dealRes.replace(val, num + 'px')

          // 移动端rem单位适配处理
          let name: string = ''
          const nList = a.match(/([A-z]|\-?)+:/)
          if (nList && nList.length > 0) name = nList[0].replace(':', '')
          const attrName: string = c.split('{')[0]
          fitMediaCss += `${attrName}{${name}:(${num}*${scale})/@rem;}\r\n`
        })
      }
    })
    if (fitMediaCss !== '') {
      fitMediaCss += '}\r\n'
      dealRes += fitMediaCss
    }
  }
  return dealRes
}

export default pcToMobile
