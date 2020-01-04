# LayoutSimple 极简 CSS 布局框架

- `layout-simple` 是为 `web` 前端响应式布局而生的 `CSS` 布局框架，基于 `LESS` 开发，可实现灵活配置、自动生成符合需求的布局框架、自动 `LESS` 变量、可用于 `PC、Mobile` 或响应式布局等 `web` 开发。
- 适用人群：前端开发布局随意性较大、已经存在设计稿件、仅需要简单的初始化与布局等基础样式、自由度需要很高的前端开发项目
- `layout-simple` 已迭代更新至 `v2.0.0` ，新版弃用部分 `class` 命名，没有进行向下兼容，所以老项目升级请谨慎操作

## Usage

### Gulp Plugin

[gulp 插件: gulp-layout-simple](https://www.npmjs.com/package/gulp-layout-simple)

> `npm i gulp-layout-simple`

```
gulp.task('layout-simple', () => {
  return gulp
    .src('./src/**/*.less')
    .pipe(gulpLayoutSimple({ // options... }))
    .pipe(
      gulpLess({
        plugins: [autoprefix]
      })
    )
    .pipe(gulpMinifyCSS())
    .pipe(gulp.dest('./dist/'))
})
```

### Webpack Loader

[webpack loader: webpack-layout-simple](https://www.npmjs.com/package/gulp-layout-simple)

> `npm i layout-simple-loader`

- `webpack.config.js`

```
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const WebpackLayoutSimpleLoader = require('layout-simple-loader')
const entry = './src/index.js'
module.exports = () => {
  const lsLoader = new WebpackLayoutSimpleLoader({ entry, // other options... })
  /**
   * lsLoader.loaderName 字符串，loader名称
   * lsLoader.loaderLess 字符串，生成布局框架less的路径
   * lsLoader.loaderRemJs 字符串，生成布局框架rem适配js路径
   * lsLoader.loaderOptions 异步函数，生成布局框架less loader options对象
   */
  return new Promise(resolve => {
    lsLoader.loaderOptions().then(lsOptions => {
      resolve({
        mode: 'production',
        entry: entry,
        output: {
          path: './dist',
          filename: 'index.js'
        },
        module: {
          rules: [
            {
              test: /\.less$/,
              exclude: /node_modules/,
              use: [
                'style-loader',
                'css-loader',
                'less-loader',
                {
                  loader: lsLoader.loaderLess,
                  options: lsOptions
                }
              ]
            }
          ]
        },
        plugins: [
          new CleanWebpackPlugin(),
          new HtmlWebpackPlugin({
            title: 'layout simple loader test',
            template: './public/index.html'
          })
        ]
      })
    })
  })
}
```

## Options

> 参数类型带有 `?` 表示为可选参数，`number[]` 表示数字数组，`string[]` 表示字符串数组

- `entry`

  - 类型: string
  - 默认: 无
  - 描述: webpack loader 专用，打包入口文件，用于将生成的 less 与 js 框架文件自动注入到入口文件中

- `fileName`

  - 类型: string
  - 默认: 'layout-simple'
  - 描述: 框架生成文件名，会在项目目录自动生成一个 less 与 js 文件

- `lessVar`

  - 类型: ?boolean
  - 默认: true
  - 描述: 是否将生成的布局 LESS 文件引用为全局变量，以便引用内置 Mixins 与自动生成的主题变量，扩展部分样式

- `webPage`

  - 类型: object
  - 描述: 页面初始化配置

  - `background`
    - 类型: ?string
    - 默认: 无
    - 描述: 页面背景样式，与 CSS 写法一致。如：`'url('test.jpg') #f3f3f3 no-repeat top center'`
  - `width`
    - 类型: string
    - 默认: '100%'
    - 描述: 页面 html/body 宽度
  - `minWidth`
    - 类型: ?string
    - 默认: '320px'
    - 描述: 页面 html/body 最小宽度
  - `maxWidth`
    - 类型: ?string
    - 默认: 无
    - 描述: 页面 html/body 最小宽度
  - `height`
    - 类型: ?string
    - 默认: 无
    - 描述: 页面 html/body 高度
  - `fontColor`
    - 类型: string
    - 默认: '#000'
    - 描述: 默认字体颜色
  - `fontFamily`
    - 类型: string
    - 默认: 'hei'
    - 描述: 默认字体 Family，与 CSS 规则一致，同时增加了 [fonts.css](https://github.com/zenozeng/fonts.css) 作为基础字体配置，也就是说，你可以直接配置为`'hei', 'kai', 'song', 'fangsong'`等选项，其直接对应 [fonts.css](https://github.com/zenozeng/fonts.css) 中的`'font-hei', 'font-kai', 'font-song', 'font-fangsong'`
  - `stockFWNormal`
    - 类型: boolean
    - 默认: true
    - 描述: 将`font-weight`不是`normal`字体全部初始化为`'font-weight:normal;'`
  - `delAUnderline`
    - 类型: boolean
    - 默认: true
    - 描述: 删除 `a` 标签默认的下划线效果
  - `iosTransparent`
    - 类型: boolean
    - 默认: true
    - 描述: 清除 IOS 按钮链接等默认的透明效果，即设置样式`input,button,select,textarea,a{-webkit-tap-highlight-color:rgba(0,0,0,0);}`
  - `delBtnDefCss`
    - 类型: boolean
    - 默认: true
    - 描述: 清楚按钮等默认样式，即设置样式`'input,button,select,textarea{outline:none;background:none;-webkit-appearance:none;}`
  - `iosBtnOpacity`
    - 类型: number
    - 默认: 1
    - 描述: 值为 0~1，设置 IOS 按钮禁用时的透明效果，即设置样式`input:disabled{-webkit-opacity:1};}`

- `gridLayout`

  - 类型: ?object
  - 描述: 栅格化布局设置

  - `gridNum`
    - 类型: number
    - 默认: 12
    - 描述: 栅格化布局，格子数，常见的为 12、24
  - `screenSize`
    - 类型: object
    - 描述: 栅格化布局适用屏幕宽度，单位为 px
    - `xl`
      - 类型: number
      - 默认: 1200
      - 描述: `col-xl-*` 适配屏幕宽度
    - `lg`
      - 类型: number
      - 默认: 960
      - 描述: `col-lg-*` 适配屏幕宽度
    - `md`
      - 类型: number
      - 默认: 720
      - 描述: `col-md-*` 适配屏幕宽度
    - `sm`
      - 类型: number
      - 默认: 540
      - 描述: `col-sm-*` 适配屏幕宽度
    - `xs`
      - 类型: number`
      - 默认: 360
      - 描述: `col-xs-*` 适配屏幕宽度

- `pc2Mobile`

  - 类型: ?object
  - 描述: 宽高等数字单位 pc 自动转换移动端

  - `scale`
    - 类型: number
    - 默认: 2
    - 描述: 数字转换比例

  > 详细说明：

  1. 比如你现在有一个 PC 端设计稿，头部是 45px，但是对应移动端头部应该为 0.9rem，代码为：

  ```
  .header { width: 100%; heiget: $ls(45); }
  /** out less:
   * .header { width: 100%; heiget: 45px; }
   * @media (max-width: 960px) {
   *    .header { width: 100%; heiget: (45*2)/@rem; }
   * }
  ```

* `pc`

  - 类型: ?object
  - 描述: PC 端设置，PC 端统一默认单位为 px

  - `mainContentWidth`
    - 类型: ?number
    - 默认: 1200
    - 描述: 页面主要内容宽度，居中显示，避免小屏丢失内容
  - `fontSize`
    - 类型: number
    - 默认: 14
    - 描述: 默认字体大小
  - `batchFontSize`
    - 类型: ?object
    - 描述: 批量生成字体
      - `start`
        - 类型: number
        - 默认: 12
        - 描述: 起始字体
      - `increase`
        - 类型: number
        - 默认: 2
        - 描述: 自动生成字体间隔，递增数
  - `elSpace`
    - 类型: ?(number | {name?:string, space:number, color:string})[]
    - 默认: 无
    - 描述: 元素上下分割线数组，详情请参阅 `elSpace` 配置详解
      - 可为数字，即分割线高度。
      - 可为对象，如：
      ```
      {
        name?: string, // 分割线class命名，符合class命名规则
        space: number, // 分割线高度
        color: string, // 分割线颜色
      }
      ```
  - `borderWidth`
    - 类型: ?number
    - 默认: 1
    - 描述: 生成主题边线按钮时，按钮边线宽度

* `mobile`

  - 类型: ?object
  - 描述: 移动端设置，移动端端统一默认单位为 rem

  - `UIWidth`
    - 类型: ?number
    - 默认: 720
    - 描述: UI 设计稿宽度
  - `htmlFontSize`
    - 类型: ?number
    - 默认: 100
    - 描述: html 根字体大小
  - `fitRange`
    - 类型: ?number[]
    - 默认: [320,960]
    - 描述: 移动端适配范围
  - `fontSize`
    - 类型: number
    - 默认: 24
    - 描述: 默认字体大小
  - `batchFontSize`
    - 类型: ?object
    - 描述: 批量生成字体
      - `start`
        - 类型: number
        - 默认: 22
        - 描述: 起始字体
      - `increase`
        - 类型: number
        - 默认: 2
        - 描述: 自动生成字体间隔，递增数
  - `elSpace`
    - 类型: ?(number | {name?:string, space:number, color:string})[]
    - 默认: 无
    - 描述: 元素上下分割线数组，详情请参阅 `elSpace` 配置详解
      - 可为数字，即分割线高度。
      - 可为对象，如：
      ```
      {
        name?: string, // 分割线class命名，符合class命名规则
        space: number, // 分割线高度
        color: string, // 分割线颜色
      }
      ```
  - `borderWidth`
    - 类型: ?number
    - 默认: 2
    - 描述: 生成主题边线按钮时，按钮边线宽度

* `batchFontSizeQty`

  - 类型: number
  - 默认: 10
  - 描述: 批量生成字体个数，默认生成 10 个，每次间隔 2。间隔与起始值配置请查阅`pc`与`mobile`的`batchFontSize`属性

* `theme`

  - 类型: ?object
  - 描述: 主题配置
  - `color`

    - 描述: 主题颜色配置
    - 配置方式较为灵活，因此这里的配置直接以 demo 来说明

      1. 字符串式配置，配置后会同时自动生成字体、按钮主题样式

      ```
      {
        main: '#2672fb'

        /** out:
         * .col_txt_main{color:#2672fb}
         * .col_btn_main{background:#2672fb;color:#fff;border-radius:10px;text-align:center;}
         * .col_btn_main-simple{border: 1px solid #2672fb;border-radius:10px;color:#2672fb;text-align:center;}
         * @media (max-width:960px) {
         *  .col_btn_main{border-radius:0.1rem;}
         *  .col_btn_main-simple{border-width: 0.02rem;border-radius:0.1rem;}
         * }
         * 注：这里的"border-width"边线宽度就是"pc"与"mobile"中设置的"borderWidth"
         */
      }
      ```

      2. 对象式配置，根据配置生成需要的主题样式

      ```
      {
       /** 参数说明
        * c: string  主题颜色
        * cText: ?boolean 是否生成字体颜色，即: ".col_txt_main{color:#2672fb}"
        * cBtn: ?boolean | object 是否生成按钮颜色
        */
       main: {
         c: '#2672fb',
         cText: true,
         cBtn: true
       },

       /* out: 与 {main: '#2672fb'} 输出效果一致 */

       /** 独立设置cBtn
        * 生成更多主题按钮与自定义其圆角
        * 其还有一个属性为"calc"，用于设置其'lighten', 'darken'的颜色减淡或加深百分比
        */
       main2: {
         c: '#80b0fc',
         cText: true,
         cBtn: {
           text: ['#fff', 'lighten', 'darken'], // 字体颜色
           borderRadius: 25 // 按钮圆角
         }
       }
       /** out:
        * .col_txt_main2{color:#80b0fc}
        * .col_btn_main2-simple{border: 1px solid #80b0fc;border-radius:25px;color:#80b0fc;text-align:center;}
        * .col_btn_main21{background:#80b0fc;color:#fff;border-radius:25px;text-align:center;}
        * .col_btn_main22{background:#80b0fc;color:lighten(#80b0fc,30%);border-radius:25px;text-align:center;}
        * .col_btn_main23{background:#80b0fc;color:darken(#80b0fc,30%);border-radius:25px;text-align:center;}
        * @media (max-width:960px) {
        *  .col_btn_main2-simple{border-width: 0.02rem;border-radius:0.25rem;}
        *  .col_btn_main21{border-radius:0.25rem;}
        *  .col_btn_main22{border-radius:0.25rem;}
        *  .col_btn_main23{border-radius:0.25rem;}
        * }
      }
      ```

> 提示：这里的 `gridLayout、theme` 均为可选配置，你可以将 `gridLayout` 配置为 `null`，即可轻易的关闭栅格化布局，不设置 `theme`，即不启用主题配置。同样的 `pc` 与 `mobile`也是可选参数，但是建议最好设置二者存在其一，否则这个布局框架将显得毫无意义，如果仅设置`pc`，那将不会去适配移动端，如果仅设置`mobile`，那将不会去对`pc端`有任何适配样式，所有的样式都会只针对移动端

### elSpace 详解

- 设置上下元素边线使用，在 web 开发中检查会有上下元素需要间隔，但是 PC 与移动端有可能在高度上需要适应，是不一致的，比如首页中有一条间隔在 PC 端是 2px，而在移动端是 5px，那么我们应该这样设置`elSpace`

```
{
  pc: {
    elSpace: [2]
  },
  mobile: {
    elSpace: [5]
  }
}

/** out:
 * .ly-space-h1 {width:100%;height:2px;}
 * @media (max-width:960px) {
 *   .ly-space-h1 {height:0.05rem;}
 * }
 * 注：PC与移动端的边线设置必须一一对应，即其下标index为一一对应
 */
```

- 当然了，你也可以自定义边线名称及边线颜色，如现在需要一条 PC 端是 1px，移动端是 4px，颜色为#eee 的边线，你可以这样设置:

```
{
  pc: {
    elSpace: [2,{
        name: 'side',
        space: 1,
        color: '#eee'
      }]
  },
  mobile: {
    elSpace: [5,{
        name: 'side',
        space: 4,
        color: '#eee'
      }]
  }
}

/** out:
 * .ly-space-h1 {width:100%;height:2px;}
 * .ly-space-side {width:100%;height:1px;background-color:#eee;}
 * @media (max-width:960px) {
 *   .ly-space-h1 {height:0.05rem;}
 *   .ly-space-side {height:0.04rem;}
 * }
 * 注：使用自定义名称配置，那么PC与移动端的边线就不是一一对应了，而是根据你所定义的名称来对应了，从示例中我们可以轻易的看出。
 */
```

## 技术栈

- LESS
- CSS
