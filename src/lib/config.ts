export interface LSWebPage {
  background?: string
  width: string
  minWidth?: string
  maxWidth?: string
  height?: string
  fontColor: string
  fontFamily: string
  stockFWNormal: boolean
  delAUnderline: boolean
  iosTransparent: boolean
  delBtnDefCss: boolean
  iosBtnOpacity: number
}

export namespace LSGridLayout {
  export interface ScreenSize {
    xl: number
    lg: number
    md: number
    sm: number
    xs: number
  }
  export interface Main {
    gridNum: number
    screenSize: ScreenSize
  }
}

export namespace LSClient {
  export interface ElSpace {
    name?: string
    space: number
    color: string
  }
  export interface PC {
    mainContentWidth?: number
    fontSize: number
    batchFontSize?: { start: number; increase: number }
    elSpace?: (number | ElSpace)[]
    borderWidth?: number
  }
  export interface Mobile extends PC {
    UIWidth: number
    htmlFontSize: number
    fitRange: number[]
  }
}

export namespace LSTheme {
  export interface LSThemeColorObjectCBtn {
    text?: string[]
    borderRadius?: number
    calc?: number
  }

  export interface LSThemeColorObject {
    c: string
    cText?: boolean
    cBtn?: boolean | LSThemeColorObjectCBtn
  }

  export interface LSThemeColor {
    [color: string]: string | LSThemeColorObject
  }

  export interface LSThemeMain {
    color: LSThemeColor
    icon: string
  }
}

export interface LSPc2Mobile {
  scale: number
}

export interface LSConfig {
  fileName: string
  lessVar: boolean
  webPage: LSWebPage
  gridLayout?: LSGridLayout.Main
  theme?: LSTheme.LSThemeMain
  pc?: LSClient.PC
  mobile?: LSClient.Mobile
  batchFontSizeQty: number
  pc2Mobile?: LSPc2Mobile
}
