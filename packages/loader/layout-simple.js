;(function(win) {
  var UIWidth = 720;
  var htmlFontSize = 100;
  var fitMinWidth = 320;
  var fitMaxWidth = 960;

  var doc = win.document
  var htmlEl = doc.documentElement
  var resize = 'orientationchange' in win ? 'orientationchange' : 'resize'
  var resizeTimer

  function startFit() {
    var screenWidth = doc.body.clientWidth || htmlEl.clientWidth
    if (screenWidth < fitMinWidth) screenWidth = fitMinWidth
    if (screenWidth > fitMaxWidth) screenWidth = fitMaxWidth
    htmlEl.style.fontSize = (screenWidth * htmlFontSize) / UIWidth + 'px'
  }

  if (win.addEventListener) {
    // 窗口发生改变时重新计算
    win.addEventListener(
      resize,
      function() {
        win.clearTimeout(resizeTimer) //防止执行两次
        resizeTimer = win.setTimeout(startFit, 300)
      },
      false
    )

    // 浏览器后退时重新计算
    win.addEventListener(
      'pageshow',
      function(e) {
        if (e.persisted) {
          win.clearTimeout(resizeTimer)
          resizeTimer = win.setTimeout(startFit, 300)
        }
      },
      false
    )

    // 页面加载完毕后计算
    win.addEventListener('DOMContentLoaded', startFit, false)
  }
})(window)
