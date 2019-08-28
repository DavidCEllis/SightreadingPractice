/**
 * Code to handle different audio input specifications (to some extent)
 */

// Polyfill for navigator.mediaDevices.getUserMedia
// Make mediaDevices if it doesn't exist
if (navigator.mediaDevices === undefined) {
  // noinspection JSValidateTypes
  navigator.mediaDevices = {}
}

if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function (constraints) {
    // noinspection JSUnresolvedVariable
    let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
    }
    return new Promise(function (resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject)
    })
  }
}

/**
 * Obtain the UserMedia along with audiocontext and a streamsource
 *
 * @returns {Promise<{audioContext: *, mic: *, media: *}>}
 */
async function getAudioInput () {
  let media = await navigator.mediaDevices.getUserMedia({ audio: true })

  // noinspection JSUnresolvedVariable
  let AudioContext = window.AudioContext || window.webkitAudioContext
  let audioContext = new AudioContext()

  let mic = audioContext.createMediaStreamSource(media)

  return { media: media, mic: mic, audioContext: audioContext }
}

export default getAudioInput
