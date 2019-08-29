/**
 * Machine learning pitch detection function using the CREPE pitch detection
 * machine learning model with tensorflow
 */
// If code handles tensorflow/resampling it's from CREPE (see LICENCE)
// if it's a nightmare trying to deal with webaudio it's probably my fault (DCE)

import * as tf from '@tensorflow/tfjs'

import getAmplitude from './amplitudemeter'

const modelFile = './static/model/model.json'

const MODEL_SAMPLERATE = 16000
const BUFFER_SIZE = 1024

/**
 * Resample an audio input buffer linearly (simplified)
 * @param buffer
 * @param resampled {Float32Array} - reusable array for output
 */
function resample (buffer, resampled) {
  const interpolate = (buffer.sampleRate % MODEL_SAMPLERATE !== 0)
  const multiplier = buffer.sampleRate / MODEL_SAMPLERATE
  const original = buffer.getChannelData(0)
  for (let i = 0; i < BUFFER_SIZE; i++) {
    if (!interpolate) {
      resampled[i] = original[i * multiplier]
    } else {
      // simplistic, linear resampling
      let left = Math.floor(i * multiplier)
      let right = left + 1
      let p = i * multiplier - left
      resampled[i] = (1 - p) * original[left] + p * original[right]
    }
  }
}

class PitchDetails {
  constructor (result, amplitude, confidence) {
    this.result = result
    this.amplitude = amplitude
    this.confidence = confidence
  }
}


/**
 * Load the tensorflow model and get the frequency detection processor
 *
 *
 * @param callback - Function called by the pitch detector, should accept a PitchDetails object
 * @returns {Promise<pitchDetect>} - Pitch detector function that uses the provided callback
 */
async function getPitchDetector (callback) {
  let tfModel = await tf.loadLayersModel(modelFile)
  const cent_mapping = tf.add(
    tf.linspace(0, 7180, 360),
    tf.tensor(1997.3794084376191)
  )
  const resampled = new Float32Array(BUFFER_SIZE)

  /**
   * Take an audio input event and return the frequency and confidence of the model
   *
   * To be used as a script processor
   *
   * @param event - audio event
   */
  function pitchDetect (event) {
    resample(event.inputBuffer, resampled)
    let amplitude = getAmplitude(resampled.slice(0, 1024))

    tf.tidy(() => {
      // run the prediction on the model
      const frame = tf.tensor(resampled.slice(0, 1024))
      const zeromean = tf.sub(frame, tf.mean(frame))
      const framestd = tf.tensor(tf.norm(zeromean).dataSync() / Math.sqrt(1024))
      const normalized = tf.div(zeromean, framestd)
      const input = normalized.reshape([1, 1024])
      const activation = tfModel.predict([input]).reshape([360])

      // the confidence of voicing activity and the argmax bin
      let confidence = activation.max().dataSync()[0]
      const center = activation.argMax().dataSync()[0]

      // slice the local neighborhood around the argmax bin
      const start = Math.max(0, center - 4)
      const end = Math.min(360, center + 5)
      const weights = activation.slice([start], [end - start])
      const cents = cent_mapping.slice([start], [end - start])

      // take the local weighted average to get the predicted pitch
      const products = tf.mul(weights, cents)
      const productSum = products.dataSync().reduce((a, b) => a + b, 0)
      const weightSum = weights.dataSync().reduce((a, b) => a + b, 0)
      const predicted_cent = productSum / weightSum
      const predicted_hz = 10 * Math.pow(2, predicted_cent / 1200.0)

      let result = predicted_hz.toFixed(3)

      callback(new PitchDetails(result, amplitude, confidence))
    })
  }

  return pitchDetect
}

/**
 * Audio process configuration and setup for the ML model
 * Deprecated method that actually works for now
 *
 * @param ctx - AudioContext
 * @param mic - MediaStreamSource
 * @param detector - pitch detector
 */

function setupAudioProcess (ctx, mic, detector) {
  const minBufferSize = ctx.sampleRate / MODEL_SAMPLERATE * BUFFER_SIZE
  let bufferSize
  for (bufferSize = 4; bufferSize < minBufferSize; bufferSize *=2) {}
  const scriptNode = ctx.createScriptProcessor(bufferSize, 1, 1)
  // noinspection JSDeprecatedSymbols
  scriptNode.onaudioprocess = detector

  // workarounds used in crepe
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, ctx.currentTime)
  mic.connect(scriptNode)
  scriptNode.connect(gain)
  gain.connect(ctx.destination)

  return scriptNode
}


export { getPitchDetector, setupAudioProcess }
