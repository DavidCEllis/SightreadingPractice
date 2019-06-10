/**
 * Module for handling audio input and passing note values to the application provided.
 *
 * This current version makes use of the ML5 and P5 libraries to use the crepe pitch detection model.
 */

import p5 from 'p5'
import 'p5/lib/addons/p5.sound'
import ml5 from 'ml5'

import { keyList } from '../music_theory/keys'

const modelFolder = './static/model'

/**
 * Convert an input frequency to a valid pitch based on 12TET A440
 * return -1 for an invalid/no pitch
 *
 * @param freq
 * @param detune - number of cents away from actual pitch accepted
 */
function freqToMidi (freq, detune = 20) {
  let midiFloat = (12 / Math.log(2)) * Math.log(freq / 440) + 69
  let midiPitch = Math.round(midiFloat)
  let diff = (midiFloat - midiPitch) * 100 // Difference from midi pitch in 12TET A440 in cents
  if (Math.abs(diff) > detune || midiFloat < 0 || midiFloat > 127) {
    return -1
  } else {
    return midiPitch
  }
}

/**
 *
 */
class AUDIOListener {
  constructor () {
    this.currentPitch = null
    this.pitchConsumed = false

    this.app = null
    this.stats = null
    this.p5 = null
    this.context = null
    this.mic = null

    this.refresh = null

    // Bind things in constructor
    this.beginDetection = this.beginDetection.bind(this)
    this.getPitch = this.getPitch.bind(this)
    this.updatePitch = this.updatePitch.bind(this)
  }

  enable (app, statsdiv = null) {
    this.app = app
    if (statsdiv) {
      this.stats = new AUDIOStats(statsdiv)
      this.stats.setup()
    }

    this.refresh = true
    // noinspection JSPotentiallyInvalidConstructorUsage
    this.p5 = new p5(function (sketch) { sketch.noCanvas() }) // eslint-disable-line

    this.context = this.p5.getAudioContext()
    this.context.resume().then(
      function () {
        console.log('Audio context resumed')
        this.mic = new p5.AudioIn()
        // noinspection JSPotentiallyInvalidUsageOfClassThis
        this.mic.start(this.beginDetection)
      }.bind(this),
      function (err) {
        console.log('Audio context failed to resume: ' + err)
      }
    )
  }

  disable () {
    console.log('Audio Detection Disabled')
    this.refresh = false
    this.mic.stop()
    this.context.suspend().then(
      function () {
        console.log('Audio context suspended')
        if (this.stats) {
          this.stats.teardown()
          this.stats = null
        }
        this.app = null
      }.bind(this),
      function (error) {
        console.log('Failed to suspend audio context: ' + error)
      }
    )
  }

  get isActive () {
    return Boolean(this.context && this.context.state === 'running')
  }

  /**
   * Callback function to update the pitch detection in the app provided
   * @param err - Callback error
   * @param freq {number} - Frequency detected by model in Hz
   */
  updatePitch (err, freq) {
    if (err) {
      console.log('Error: ' + err)
      this.disable()
    } else if (this.app) {
      let appConfig = this.app.config
      let audioNoiseFloor = appConfig.audioNoiseFloor
      let audioMinAmplitude = appConfig.audioMinAmplitude
      let micLevel = this.mic.getLevel(appConfig.amplitudeSmoothing)

      // Update statistics for level
      if (this.stats !== null) {
        this.stats.loudestLevel = Math.max(this.stats.loudestLevel, micLevel)
        this.stats.quietestLevel = Math.min(this.stats.quietestLevel, micLevel)
      }

      if (freq && micLevel > audioMinAmplitude) {
        let pitch = freqToMidi(freq, appConfig.pitchDetune)
        let confidence = this.pitch.results.confidence

        // If pitch is not out of tune and is different or this pitch has not been consumed
        let validPitch = Boolean(pitch > 0)
        let newNote = Boolean(this.currentPitch !== pitch || !this.pitchConsumed)
        let confidentInPitch = Boolean(confidence > appConfig.minConfidence)

        if (validPitch && newNote && confidentInPitch) {
          let pitchDetails = keyList['C'].getRepresentation(pitch)
          let pitchName = pitchDetails.name + (Math.floor(pitch / 12) - 1)
          this.app.compareNote(pitch)
          this.currentPitch = pitch
          this.pitchConsumed = true

          // Update statistics for valid notes
          this.stats.lastValidNote = pitchName
          this.stats.lastConfidence = confidence
          this.stats.lastLevel = micLevel
        }
      } else if (micLevel < audioNoiseFloor) {
        this.pitchConsumed = false // If the input is lower than the minimum threshold, reset
      }
      if (this.stats !== null) {
        this.stats.render()
      }
      this.getPitch()
    }
  }

  /**
   * getPitch
   *
   * Kick off the pitch detection and get called again in the callback
   */
  getPitch () {
    if (this.refresh) {
      this.pitch.getPitch(this.updatePitch)
    }
  }

  beginDetection () {
    this.pitch = ml5.pitchDetection(
      modelFolder,
      this.context,
      this.mic.stream,
      function () { console.log('Audio Detection Started.') }
    )
    this.getPitch()
  }
}

class AUDIOStats {
  constructor (div) {
    this.div = div
    this.lastValidNote = 'N/A'
    this.lastConfidence = -1
    this.lastLevel = -1
    this.quietestLevel = 1.0 // 1 is the maximum
    this.loudestLevel = 0.0 // 0 is the minimum
  }

  /**
   * Create statistics layout in div and reveal div
   */
  setup () {
    this.div.hidden = false
    this.div.style = 'border: 2px solid black; width: 300px;'
    this.render()
  }

  /**
   * Clear statistics from div and hide div
   */
  teardown () {
    this.div.hidden = true
    this.div.innerHTML = ''
  }

  reset () {
    this.lastValidNote = 'N/A'
    this.lastConfidence = -1
    this.lastLevel = -1
    this.quietestLevel = 1.0
    this.loudestLevel = 0.0
  }

  /**
   * update statistics in div
   */
  render () {
    // language=HTML
    this.div.innerHTML = `
    <pre>
    Last Note: ${this.lastValidNote}
    Last Note Confidence: ${(this.lastConfidence * 100).toFixed(2)}%
    Last Note Level: ${(this.lastLevel * 10000).toFixed(2)}
    
    Quietest Level: ${(this.quietestLevel * 10000).toFixed(2)}
    Loudest Level: ${(this.loudestLevel * 10000).toFixed(2)}
    </pre>
    `.trim()
  }
}

export { AUDIOListener }
