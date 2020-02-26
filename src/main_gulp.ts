import fs from 'fs'
import path from 'path'
import tmp from 'tmp'
import through2 from 'through2'
import gulpUtil from 'gulp-util'
import merge from 'merge-objects'

import DefaultLSConfig from './laysim.config'
import { LSConfig, LSGridLayout, LSClient } from './lib/config'
import CreateTheme from './lib/theme'
import CreateInitStyle from './lib/initStyle'
import CreateGridLayout from './lib/gridLayout'
import CreateFontStyle from './lib/fontStyle'
import CreateLayoutStyle from './lib/layoutStyle'
import pcToMobile from './lib/pc2Mobile'
import adaptationJs from './lib/adaptation'

class GulpLayoutSimple {
  options: LSConfig
  pluginName: string
  tmpLessFile?: tmp.FileResult
  resultLessFile?: gulpUtil.File.BufferFile
  resultJsFile?: gulpUtil.File.BufferFile
  constructor(options?: LSConfig) {
    this.options = merge(DefaultLSConfig, options || {})
    this.pluginName = 'gulp-layout-simple'
  }
  createLS(): gulpUtil.File.BufferFile {
    // 创建layout-simple.less文件
    const _this = this
    const options = this.options
    const lessName = options.fileName + '.less'

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

    // 合并模块变量
    const lessMixinUrl = path.join(__dirname, 'less/mixin.less')
    const lessMixin: Buffer = fs.readFileSync(lessMixinUrl)
    const mLessVar: string = lessMixin + themeLessVar + initLessVar

    // 合并模块样式
    const lessMainUrl = path.join(__dirname, 'less/main.less')
    const lessMain: Buffer = fs.readFileSync(lessMainUrl)
    const modularLess: string =
      lessMain +
      themeLess +
      initStyleLess +
      fontStyleLess +
      layoutStyleLess +
      gridLayoutLess

    // 生成临时less以便用于全局变量编译
    if (options.lessVar) {
      _this.tmpLessFile = tmp.fileSync({
        postfix: '.less'
      })
      fs.writeFileSync(_this.tmpLessFile.name, mLessVar + modularLess)
    }

    // 合并生成最终layout-simple.less文件
    const resultLessFile: gulpUtil.File.BufferFile = new gulpUtil.File({
      path: lessName,
      contents: Buffer.from(mLessVar + modularLess)
    })
    return resultLessFile
  }
  createLess() {
    // 处理less文件及生成layout-simple.less
    const _this = this
    const options = this.options
    const lessName = options.fileName + '.less'
    const stream = through2
      .obj(function(file, encoding, cb) {
        if (file.isNull()) return cb(null, file)

        // 添加处理完毕的layout-simple.less到输出文件列表
        if (!_this.resultLessFile && file.path !== lessName) {
          _this.resultLessFile = _this.createLS()
          this.push(_this.resultLessFile)
        }

        // 处理需要pc转换mobile的less代码
        const dealUnitRes: string = pcToMobile(
          file.contents.toString(),
          options.pc2Mobile,
          options.mobile?.fitRange
        )

        // 添加layout-simple.less到less文件头部引用其变量
        let importLS: string = ''
        if (options.lessVar && _this.tmpLessFile) {
          importLS = '@import (reference) "' + _this.tmpLessFile.name + '";\r\n'
        }

        // 合并处理后的less文件添加到输出文件列表
        file.contents = Buffer.from(importLS + dealUnitRes)
        this.push(file)
        cb()
      })
      .on('finish', () => {
        // 移除生成的layout-simple.less临时文件
        if (_this.tmpLessFile) _this.tmpLessFile.removeCallback()
      })

    return stream
  }
  adaptation() {
    // 生成rem适配js
    const _this = this
    const mobile = this.options.mobile
    const jsName = this.options.fileName + '.js'
    if (!mobile) return
    const resultJs: string = adaptationJs(<LSClient.Mobile>mobile)
    const stream = through2.obj(function(file, encoding, cb) {
      if (!_this.resultJsFile && file.path !== jsName) {
        _this.resultJsFile = new gulpUtil.File({
          path: jsName,
          contents: Buffer.from(resultJs)
        })
        this.push(_this.resultJsFile)
      }

      if (!file.isNull() && !file.isStream()) {
        this.push(file)
      }

      cb()
    })
    return stream
  }
}

module.exports = GulpLayoutSimple
