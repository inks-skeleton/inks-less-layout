import fs from 'fs'
import path from 'path'
import merge from "merge-objects"

import DefaultLSConfig from './laysim.config'
import { LSConfig, LSGridLayout, LSClient } from './lib/config'
import CreateTheme from './lib/theme'
import CreateInitStyle from './lib/initStyle'
import CreateGridLayout from './lib/gridLayout'
import CreateFontStyle from './lib/fontStyle'
import CreateLayoutStyle from './lib/layoutStyle'
import adaptation from './lib/adaptation'

interface WebpackLSConfig extends LSConfig {
  lessPath?: string
  remJsPath?: string
}

class WebpackLayoutSimple {
  options: WebpackLSConfig
  loaderLess: string
  lessPath: string
  remJsPath: string | void
  constructor(options: LSConfig) {
    this.options = merge(DefaultLSConfig, options || {})
    this.loaderLess = path.join(__dirname, './loaderLess.js')
    this.options.lessPath = this.lessPath = this.createLess()
    this.options.remJsPath = this.remJsPath = this.createRemJs() || undefined
  }
  createLess(): string {
    const options = this.options
    // 生成主题
    const theme = new CreateTheme(<LSConfig>options)
    const themeLess: string = theme.resultCss
    const themeLessVar: string = theme.lessVar

    // 初始化css
    const initStyle = new CreateInitStyle(<LSConfig>options)
    const initStyleLess: string = initStyle.resultCss
    const initLessVar: string = initStyle.lessVar

    // 生成字体样式
    const fontStyle = new CreateFontStyle(<LSConfig>options)
    const fontStyleLess: string = fontStyle.resultCss

    // 生成布局样式
    const layoutStyle = new CreateLayoutStyle(<LSConfig>options)
    const layoutStyleLess: string = layoutStyle.resultCss

    // 生成栅格化布局
    let gridLayoutLess: string = ''
    if (options.gridLayout) {
      gridLayoutLess = new CreateGridLayout(
        <LSGridLayout.Main>options.gridLayout
      ).resultCss
    }

    const lessMixinUrl: string = path.join(__dirname, 'less/mixin.less')
    const lessMainUrl: string = path.join(__dirname, 'less/main.less')
    const lessMixin: string = fs.readFileSync(lessMixinUrl).toString()
    const lessMain: string = fs.readFileSync(lessMainUrl).toString()

    // 合并模块变量
    const mLessVar: string = lessMixin + themeLessVar + initLessVar

    // 合并模块样式
    const modularLess: string =
      lessMain +
      themeLess +
      initStyleLess +
      fontStyleLess +
      layoutStyleLess +
      gridLayoutLess

    // 生成最终结果
    const lessResult: string = mLessVar + modularLess

    // 生成临时less以便用于全局变量编译
    const lessName: string = options.fileName + '.less'
    const lessOutPath: string = path.join(__dirname, lessName)
    fs.writeFileSync(lessOutPath, lessResult, 'utf8')
    return lessOutPath
  }
  createRemJs(): string | void {
    // 生成rem适配js
    const options = this.options
    const mobile = options.mobile
    if (!mobile) return
    const remJsResult: string = adaptation(<LSClient.Mobile>mobile)
    const remJsName: string = options.fileName + '.js'
    const remJsOutPath: string = path.join(__dirname, remJsName)
    fs.writeFileSync(remJsOutPath, remJsResult, 'utf8')
    return remJsOutPath
  }
}

module.exports = WebpackLayoutSimple
