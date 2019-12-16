const moduleToCdn = require('module-to-cdn')

const CDNLinks = {
  'bootstrap': {
    name: 'bootstrap',
    var: 'bootstrap',
    url: 'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js',
    version: '4.4.1'
  },
  'popper.js': {
    name: 'popper.js',
    var: 'popper.js',
    url: 'https://unpkg.com/popper.js@1.16.0/dist/umd/popper.min.js',
    version: '1.16.0'
  },
  '@tensorflow/tfjs': {
    name: '@tensorflow/tfjs',
    var: 'tf',
    url: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.4.0/dist/tf.min.js',
    version: '1.4.0'
  },
  'vexflow': {
    name: 'VexFlow',
    var: 'Vex',
    url: 'https://unpkg.com/vexflow@1.2.89/releases/vexflow-min.js',
    version: '1.2.89'
  }
}

function extendedModuleToCdn (moduleName, version, options = null) {
  if (moduleName in CDNLinks) {
    // console.log('Found: ' + moduleName)
    return CDNLinks[moduleName]
  } else {
    // console.log('Not Found: ' + moduleName)
    let result = moduleToCdn(moduleName, version, options)
    if (result) {
      return result
    }
  }
  return null
}

module.exports.extendedModuleToCdn = extendedModuleToCdn
