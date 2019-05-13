const moduleToCdn = require('module-to-cdn')

const CDNLinks = {
  'ml5': { name: 'ml5', var: 'ml5', url: 'https://unpkg.com/ml5@0.2.3/dist/ml5.min.js', version: '0.2.3' },
  'p5': { name: 'p5', var: 'p5', url: 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.8.0/p5.min.js', version: '0.8.0' }
  // 'p5/lib/addons/p5.sound': { name: 'p5.sound', var: 'p5.sound', url: 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.8.0/addons/p5.sound.min.js', version: '0.8.0' }
  // 'vexflow': { name: 'VexFlow', var: 'Vex', url: 'https://unpkg.com/vexflow@1.2.89/releases/vexflow-min.js', version: '1.2.89' }
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
