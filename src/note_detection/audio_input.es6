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
  }
  enable (app) {
    this.app = app
    this.refresh = true
    this.p5 = new p5(this.p5s) // eslint-disable-line
    this.context = this.p5.getAudioContext()
    this.context.resume()
    this.mic = new p5.AudioIn()
    this.mic.start(this.beginDetection.bind(this))
  }
  disable () {
    console.log('Audio Detection Disabled')
    this.refresh = false
    this.mic.stop()
    this.context.suspend()
    this.app = null
  }
  p5s (sketch) {
    sketch.noCanvas()
  }
  get isActive () {
    return Boolean(this.context && this.context.state === 'running')
  }
  updatePitch (err, freq) {
    let audioThreshold = this.app.config.audioThreshold
    if (err) {
      console.log('Error: ' + err)
      this.disable()
    } else if (freq && this.mic.getLevel() > audioThreshold) {
      let pitch = freqToMidi(freq)
      // If pitch is not out of tune and is different or this pitch has not been consumed
      if (pitch > 0 && (this.currentPitch !== pitch || !this.pitchConsumed)) {
        this.app.compareNote(pitch)
        this.currentPitch = pitch
        this.pitchConsumed = true
      }
    } else {
      this.pitchConsumed = false // If the input is null also reset note
    }
  }
  getPitch () {
    if (this.refresh) {
      this.pitch.getPitch(this.updatePitch.bind(this))
      setTimeout(this.getPitch.bind(this), 10)
    }
  }
  beginDetection () {
    this.pitch = ml5.pitchDetection(
      './static/model',
      this.context,
      this.mic.stream,
      this.detectionStarted.bind(this)
    )
    this.getPitch()
  }
  detectionStarted () {
    console.log('Audio detection started.')
  }
}

export { AUDIOListener }
