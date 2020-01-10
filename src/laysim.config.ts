const options = {
  fileName: 'layout-simple',
  lessVar: true,
  webPage: {
    background: '#f3f3f3',
    width: '100%',
    minWidth: '320px',
    maxWidth: '',
    height: '',
    fontColor: '#000',
    fontFamily: 'hei',
    stockFWNormal: true,
    delAUnderline: true,
    iosTransparent: true,
    delBtnDefCss: true,
    iosBtnOpacity: 1
  },
  gridLayout: {
    screenSize: {
      xl: 1200,
      lg: 960,
      md: 720,
      sm: 540,
      xs: 360
    },
    gridNum: 12
  },
  pc2Mobile: {
    scale: 2
  },
  batchFontSizeQty: 10,
  pc: {
    mainContentWidth: 1200,
    fontSize: 14,
    batchFontSize: {
      start: 12,
      increase: 2
    },
    elSpace: [],
    borderWidth: 1
  },
  mobile: {
    UIWidth: 720,
    htmlFontSize: 100,
    fitRange: [320, 960],
    fontSize: 24,
    batchFontSize: {
      start: 22,
      increase: 2
    },
    elSpace: [],
    borderWidth: 2
  }
}

export default options
