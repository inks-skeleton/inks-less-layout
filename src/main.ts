import fs from 'fs'
import Config from './lsconfig'
import { LSConfig, LSGridLayout } from './lib/config'
import CreateTheme from './lib/theme'
import CreateInitStyle from './lib/initStyle'
import CreateGridLayout from './lib/gridLayout'
import CreateFontStyle from './lib/fontStyle'
import CreateLayoutStyle from './lib/layoutStyle'

const themeCss: string = new CreateTheme(<LSConfig>Config).resultCss
const initStyleCss: string = new CreateInitStyle(<LSConfig>Config).resultCss
const fontStyleCss: string = new CreateFontStyle(<LSConfig>Config).resultCss
const layoutStyleCss: string = new CreateLayoutStyle(<LSConfig>Config).resultCss
let gridLayoutCss: string = ''
if (Config.gridLayout) {
  gridLayoutCss = new CreateGridLayout(<LSGridLayout.Main>Config.gridLayout)
    .resultCss
}
const modularLess: string =
  themeCss + initStyleCss + fontStyleCss + layoutStyleCss + gridLayoutCss
const indexLess: Buffer = fs.readFileSync('./dist/index.less')
const url: string = './dist/layoutsimple.less'
fs.writeFile(url, indexLess + modularLess, function() {
  console.log('编译成功')
  console.log(url)
})
