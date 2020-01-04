import fs from 'fs'
import path from 'path'
import { LSClient } from './config'

function adaptation(options: LSClient.Mobile): string {
  const remJsUrl = path.join(__dirname, 'js/rem.js')
  let remJs: string = fs.readFileSync(remJsUrl).toString()
  remJs = remJs.replace('$_UIWidth', options.UIWidth + ';')
  remJs = remJs.replace('$_htmlFontSize', options.htmlFontSize + ';')
  remJs = remJs.replace('$_fitMinWidth', options.fitRange[0] + ';')
  remJs = remJs.replace('$_fitMaxWidth', options.fitRange[1] + ';')
  return remJs
}

export default adaptation
