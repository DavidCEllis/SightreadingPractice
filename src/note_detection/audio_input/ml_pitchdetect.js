/**
 * Machine learning pitch detection function using the CREPE pitch detection
 * machine learning model with tensorflow
 */
// If code handles tensorflow/resampling it's from CREPE (see LICENCE)
// if it's a nightmare trying to deal with webaudio it's probably my fault (DCE)

import * as tf from '@tensorflow/tfjs'

const modelFolder = './static/model'

const MODEL_SAMPLERATE = 16000
const BUFFER_SIZE = 1024


/**
 * Resample an audio input buffer linearly (simplified)
 * @param buffer
 * @returns {Float32Array}
 */
function resample (buffer) {
  const interpolate = (buffer.sampleRate % MODEL_SAMPLERATE !== 0)
  const multiplier = buffer.sampleRate / MODEL_SAMPLERATE
  const original = buffer.getChannelData(0)
  const subsamples = new Float32Array(BUFFER_SIZE)
  for (let i = 0; i < BUFFER_SIZE; i++) {
    if (!interpolate) {
      subsamples[i] = original[i * multiplier]
    } else {
      // simplistic, linear resampling
      let left = Math.floor(i * multiplier)
      let right = left + 1
      let p = i * multiplier - left
      subsamples[i] = (1 - p) * original[left] + p * original[right]
    }
  }
  return subsamples
}

/**
 * Load the tensorflow model and get the frequency detection processor
 */
async function getPitchDetector (callback) {
  let tfModel = await tf.loadLayersModel(modelFolder)
  const cent_mapping = tf.add(
    tf.linspace(0, 7180, 360),
    tf.tensor(1997.3794084376191)
  )

  /**
   * Take an audio input event and return the frequency and confidence of the model
   * @param event
   */
  function pitchDetect (event) {
    let resampled = resample(event)
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

      callback({ frequency: result, confidence: confidence })
    })
  }

  return pitchDetect
}

export { getPitchDetector }
