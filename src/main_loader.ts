import fs from 'fs'
import path from 'path'

import DefaultLSConfig from './lsconfig'
import { LSConfig, LSGridLayout, LSClient } from './lib/config'
import CreateTheme from './lib/theme'
import CreateInitStyle from './lib/initStyle'
import CreateGridLayout from './lib/gridLayout'
import CreateFontStyle from './lib/fontStyle'
import CreateLayoutStyle from './lib/layoutStyle'
import adaptation from './lib/adaptation'

interface WebpackLSConfig extends LSConfig {
  entry: string
  lessPath?: string
  remJsPath?: string
}

class WebpackLayoutSimpleLoader {
  loaderName: string
  options: WebpackLSConfig
  loaderLess: string
  loaderRemJs: string
  constructor(options: WebpackLSConfig) {
    this.loaderName = 'layout-simple-loader'
    this.options = Object.assign({}, DefaultLSConfig, options || {})
    this.loaderLess = path.join(__dirname, './loaderLess.js')
    this.loaderRemJs = path.join(__dirname, './loaderRemJs.js')
  }
  createLS(): Promise<string> {
    const { loaderName, options } = this
    return new Promise(resolve => {
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
      fs.readFile(lessMixinUrl, (mixinErr, lessMixin) => {
        if (mixinErr) throw new Error('[' + loaderName + ']- ' + mixinErr)
        // 合并模块变量
        const mLessVar: string = lessMixin + themeLessVar + initLessVar

        fs.readFile(lessMainUrl, (mainErr, lessMain) => {
          if (mainErr) throw new Error('[' + loaderName + ']- ' + mainErr)

          // 合并模块样式
          const modularLess: string =
            lessMain +
            themeLess +
            initStyleLess +
            fontStyleLess +
            layoutStyleLess +
            gridLayoutLess

          const lessResult: string = mLessVar + modularLess

          // 生成临时less以便用于全局变量编译
          const lessName: string = options.fileName + '.less'
          const lessOutPath: string = path.join(__dirname, lessName)
          fs.writeFile(lessOutPath, lessResult, 'utf8', lessOutErr => {
            if (lessOutErr) {
              throw new Error('[' + loaderName + ']- ' + lessOutErr)
            }
            resolve(lessOutPath)
          })
        })
      })
    })
  }
  adaptation(): Promise<string> {
    const { loaderName, options } = this
    const mobile = options.mobile
    return new Promise(resolve => {
      // 生成rem适配js
      if (!mobile) return resolve()
      const remJsResult: string = adaptation(<LSClient.Mobile>mobile)
      const remJsName: string = options.fileName + '.js'
      const remJsOutPath: string = path.join(__dirname, remJsName)
      fs.writeFile(remJsOutPath, remJsResult, jsOutErr => {
        if (jsOutErr) throw new Error('[' + loaderName + ']- ' + jsOutErr)
        resolve(remJsOutPath)
      })
    })
  }
  loaderOptions(): Promise<WebpackLSConfig> {
    const options = this.options
    let importLessPath: string = ''
    return new Promise(resolve => {
      this.createLS().then(lessOutPath => {
        importLessPath = lessOutPath.replace(/\\/g, '/')
        const importLess: string = lessOutPath
          ? `import '${importLessPath}'\r\n`
          : ''

        this.adaptation().then(remJsOutPath => {
          const importJsPath = remJsOutPath.replace(/\\/g, '/')
          const importJs: string = remJsOutPath
            ? `import '${importJsPath}'\r\n`
            : ''
          if (lessOutPath || remJsOutPath) {
            const entryPath = path.join(this.options.entry)
            fs.readFile(entryPath, (err, data) => {
              if (err) throw new Error('[' + this.loaderName + ']- ' + err)
              const contents: string = data.toString()
              const isImport: boolean =
                contents.indexOf(importLess) >= 0 ||
                contents.indexOf(importJs) >= 0
              const optionsResult = Object.assign({}, options, {
                lessPath: importLessPath,
                remJsPath: importJsPath
              })

              if (isImport) return resolve(optionsResult)

              const dealResult: string = importLess + importJs + contents
              fs.writeFile(entryPath, dealResult, dealOutErr => {
                if (dealOutErr) {
                  throw new Error('[' + this.loaderName + ']- ' + dealOutErr)
                }
                resolve(optionsResult)
              })
            })
          }
        })
      })
    })
  }
}

module.exports = WebpackLayoutSimpleLoader
