/**
 * Provide a listener that reads audio input and uses pitch detection to provide
 * notes to the app.
 *
 * Exposing the same functionality as the midi input with the addition of
 * audio input processing statistics.
 */

import { keyList } from '../../music_theory/keys'
import AudioStatsDisplay from './statsdisplay'
import freqToMidi from './freqtomidi'
import getAudioInput from './getstream'
import { getPitchDetector, setupAudioProcess } from './ml_pitchdetect'

/**
 * Audio Listener
 *
 * Handles setup and teardown of audio listening and pitch detection for the app.
 */
class AudioListener {
  /**
   * @private
   */
  constructor () {
    this.currentPitch = null
    this.pitchConsumed = false
    this.lastRefreshed = Date.now() / 1000

    this.app = null
    this.config = null
    this.stats = null

    this.isActive = false

    this.context = null
    this.mic = null
    this.media = null
    this.scriptNode = null

    this.baseKey = keyList['C']

    // Bind things in constructor
    this.comparePitch = this.comparePitch.bind(this)

    this.detector = null
  }

  /**
   * Enable the web audio listener and setup the stats page.
   *
   * @param app - sight reading practice application
   * @param statsdiv - html element where stats should be displayed
   */
  async enable (app, statsdiv = null) {
    this.app = app
    this.config = this.app.config

    this.detector = await getPitchDetector(this.comparePitch)

    if (statsdiv) {
      this.stats = new AudioStatsDisplay(statsdiv)
      this.stats.setup() // reveal stats page
    }

    // Get the audio context or resume if it already exists
    if (this.context === null) {
      let input = await getAudioInput()
      this.context = input.audioContext
      this.mic = input.mic
      this.media = input.media

      this.scriptNode = setupAudioProcess(this.context, this.mic, this.detector)

    } else if (this.context.state === 'suspended') {
      await this.context.resume()
    }

    this.isActive = true
    console.log('Audio Detection Enabled')

  }

  /**
   * Disable listening for inputs via web audio
   */
  async disable () {
    // Disconnect everything
    this.mic.disconnect()
    this.scriptNode.disconnect()

    // Stop all media stream tracks and remove them
    this.media.getAudioTracks().forEach(
      (element) => {
        element.stop()
        this.media.removeTrack(element)
      }
    )

    // Close the context and remove it
    await this.context.close()
    this.context = null

    this.stats.teardown() // hide stats page
    this.isActive = false
    console.log('Audio Detection Disabled')
  }

  // INTERNAL METHODS
  /**
   * Given a pitch number get the appropriate name/octave combination
   * @private
   *
   * @param {number} pitch
   * @returns {string}
   */
  getPitchName (pitch) {
    // Get pitch name and octave number as a string
    return this.baseKey.getRepresentation(pitch).name + (Math.floor(pitch / 12) - 1)
  }

  /**
   * This is the pitch comparison function to be used in a callback and updates
   * the app based on the input from the TensorFlow model.
   * @private
   *
   * @param pitchResult - pitchResult object with amplitude/confidence/frequency
   */
  comparePitch (pitchResult) {
    let appConfig = this.app.config

    let minConfidence = appConfig.minConfidence
    let noiseFloor = appConfig.audioNoiseFloor
    let minAmplitude = appConfig.audioMinAmplitude

    let amplitude = pitchResult.amplitude
    let confidence = pitchResult.confidence
    let frequency = pitchResult.frequency

    // Check confident in pitch and min amplitude
    let confidentCheck = (confidence === undefined || confidence > minConfidence)
    let amplitudeCheck = (amplitude > minAmplitude)

    // Update some stats
    let lastStats = this.stats.state
    this.stats.loudestLevel = Math.max(this.stats.loudestLevel, amplitude)
    this.stats.quietestLevel = Math.min(this.stats.quietestLevel, amplitude)

    // If loud and confident enough, do some work
    if (confidentCheck && amplitudeCheck) {
      let pitch = freqToMidi(frequency, appConfig.pitchDetune)
      let validPitch = Boolean(pitch > 0)
      let newNote = Boolean(this.currentPitch !== pitch || !this.pitchConsumed)

      if (validPitch && newNote) {
        let pitchName = this.getPitchName(pitch)

        // Actually compare notes and update the app!
        this.app.compareNote(pitch)

        this.currentPitch = pitch
        this.pitchConsumed = true

        this.stats.lastValidNote = pitchName
        this.stats.lastConfidence = confidence
        this.stats.lastLevel = amplitude
      }
    } else if (amplitude < noiseFloor) {
      this.pitchConsumed = false
    }
    // Render stats if they've changed and only 1x per second
    let newTime = Date.now() / 1000
    if (!this.stats.equal(lastStats) && ((newTime - this.lastRefreshed) > 0.1)) {
      this.stats.render()
      this.lastRefreshed = newTime
    }
  }
}

export { AudioListener }
