const MODE_TYPE = process.env.MODE_TYPE
const pluginName = 'webpack-ls-build-config'
const packageJson = require('../packageJson/' + MODE_TYPE + '.json')
const packageObj = JSON.parse(JSON.stringify(packageJson))
const packageJsonCommon = require('../../package.json')
const packageObjCommon = JSON.parse(JSON.stringify(packageJsonCommon))

class BuildConfigPlugin {
  constructor(output) {
    this.output = output
  }
  apply(compiler) {
    const output = this.output
    compiler.hooks.compilation.tap(pluginName, compilation => {
      let packageResults = Object.assign({}, packageObjCommon, packageObj)
      packageResults.main = output + '/index.js'
      packageResults.files = [output]
      packageResults.private = false
      packageResults.scripts = {}
      packageResults.devDependencies = {}
      const results = JSON.stringify(packageResults)
      compilation.assets['package.json'] = {
        source: function() {
          return results
        },
        size: function() {
          return results.length
        }
      }
    })
  }
}

BuildConfigPlugin.getDependencies = function() {
  let externals = {}
  for (let s in packageObj.dependencies) {
    externals[s] = s
  }
  return externals
}

BuildConfigPlugin.getCopyFile = function(output) {
  const copyFileList = {
    gulp: ['less', 'js'],
    loader: ['less', 'js']
  }
  const nowProjectCopy = copyFileList[MODE_TYPE]
  nowProjectCopy.push('README.md')
  return nowProjectCopy.map(c => {
    const srcUrl = c.indexOf('.') > 0 ? c : `src/${c}/`
    return {
      from: process.cwd() + '/' + srcUrl,
      to: output + '/' + c
    }
  })
}

module.exports = BuildConfigPlugin
