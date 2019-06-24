// Polyfill for navigator.mediaDevices.getUserMedia
// Make mediaDevices if it doesn't exist
if (navigator.mediaDevices === undefined) {
  // noinspection JSValidateTypes
  navigator.mediaDevices = {}
}

if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function(constraints) {
    // noinspection JSUnresolvedVariable
    let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia
    if (!getUserMedia) {
      return promise.reject(new Error("getUserMedia is not implemented in this browser"))
    }
    return new Promise(function(resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject)
    })
  }
}

async function getAudioInput(statusFunc) {
  statusFunc('Initialising audio input...')
  let media = await navigator.mediaDevices.getUserMedia({audio: true})

  // noinspection JSUnresolvedVariable
  let AudioContext = window.AudioContext || window.webkitAudioContext
  let audioContext = new AudioContext()

  let mic = audioContext.createMediaStreamSource(media)
}
