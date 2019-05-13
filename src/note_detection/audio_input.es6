import p5 from 'p5'
import 'p5/lib/addons/p5.sound'
import ml5 from 'ml5'

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
    this.p5 = null
    this.context = null
    this.mic = null

    this.refresh = null

    // Bind things in constructor
    this.beginDetection = this.beginDetection.bind(this)
    this.getPitch = this.getPitch.bind(this)
    this.updatePitch = this.updatePitch.bind(this)
  }
  enable (app) {
    this.app = app
    this.refresh = true
    // noinspection JSPotentiallyInvalidConstructorUsage
    this.p5 = new p5(function (sketch) { sketch.noCanvas() }) // eslint-disable-line

    this.context = this.p5.getAudioContext()
    this.context.resume().then(
      function() {
        console.log('Audio context resumed')
        this.mic = new p5.AudioIn()
        // noinspection JSPotentiallyInvalidUsageOfClassThis
        this.mic.start(this.beginDetection)
      }.bind(this),
      function(err) {
        console.log('Audio context failed to resume: ' + err)
      }.bind(this)
    )
  }
  disable () {
    console.log('Audio Detection Disabled')
    this.refresh = false
    this.mic.stop()
    this.context.suspend().then(
      function() {
        console.log('Audio context suspended')
        this.app = null
      }.bind(this),
      function(error) {
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

      if (freq && micLevel > audioMinAmplitude) {
        let pitch = freqToMidi(freq, appConfig.pitchDetune)
        let confidence = this.pitch.results.confidence
        // If pitch is not out of tune and is different or this pitch has not been consumed
        let validPitch = Boolean(pitch > 0)
        let newNote = Boolean(this.currentPitch !== pitch || !this.pitchConsumed)
        let confidentInPitch = Boolean(confidence > appConfig.minConfidence)

        if (validPitch && newNote && confidentInPitch) {
          console.log('New Note: ' + pitch)
          console.log('Amplitude: ' + micLevel)
          console.log('Confidence: ' + this.pitch.results.confidence)
          this.app.compareNote(pitch)
          this.currentPitch = pitch
          this.pitchConsumed = true
        }
      } else if (micLevel < audioNoiseFloor) {
        this.pitchConsumed = false // If the input is lower than the minimum threshold, reset
      }
    }
  }

  /**
   * getPitch
   *
   * the 'loop' to get the pitch from the model
   */
  getPitch () {
    if (this.refresh) {
      this.pitch.getPitch(this.updatePitch)
      setTimeout(this.getPitch, this.app.config.sleepInterval)
    }
  }
  beginDetection () {
    this.pitch = ml5.pitchDetection(
      './static/model',
      this.context,
      this.mic.stream,
      function () { console.log('Audio Detection Started.')}
    )
    this.getPitch()
  }
}

export { AUDIOListener }
