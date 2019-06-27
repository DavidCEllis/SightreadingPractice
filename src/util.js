const moduleToCdn = require('module-to-cdn')

const CDNLinks = {
  '@tensorflow/tfjs': { name: '@tensorflow/tfjs', var: 'tf', url: "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.2.1/dist/tf.min.js", version: '1.2.1'},
  'vexflow': { name: 'VexFlow', var: 'Vex', url: 'https://unpkg.com/vexflow@1.2.89/releases/vexflow-min.js', version: '1.2.89' }
}

function extendedModuleToCdn (moduleName, version, options = null) {
  if (moduleName in CDNLinks) {
    // console.log('Found: ' + moduleName)
    return CDNLinks[moduleName]
  } else {
    // console.log('Not Found: ' + moduleName)
    let result = moduleToCdn(moduleName, version, options)
    if (result) {
      // console.log(result)
      return result
    }
  }
  return null
}

module.exports.extendedModuleToCdn = extendedModuleToCdn
