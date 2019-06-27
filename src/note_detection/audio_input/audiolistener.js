/**
 * This file holds the main class that handles note detection for the audio input mode
 *
 * Exposing the same functionality as the midi input with the addition of
 * audio input processing statistics.
 */

import { keyList } from '../../music_theory/keys'
import AudioStatsDisplay from './statsdisplay'
import freqToMidi from './freqtomidi'
import getAudioInput from './getstream'
import { getPitchDetector, setupAudioProcess } from './ml_pitchdetect'


class AudioListener {
  constructor () {
    this.currentPitch = null
    this.pitchConsumed = false
    this.lastRefreshed = Date.now() / 1000

    this.app = null
    this.config = null
    this.stats = null

    this.refresh = null
    this.isActive = false

    this.context = null
    this.mic = null
    this.scriptNode = null

    this.baseKey = keyList['C']

    // Bind things in constructor
    this.comparePitch = this.comparePitch.bind(this)

    this.detector = null
  }

  async enable (app, statsdiv = null) {
    this.app = app
    this.config = this.app.config

    this.detector = await getPitchDetector(this.comparePitch)

    if (statsdiv) {
      this.stats = new AudioStatsDisplay(statsdiv)
      this.stats.setup() // reveal stats page
    }

    this.refresh = true

    // Get the audio context or resume if it already exists
    if (this.context === null) {
      let input = await getAudioInput()
      this.context = input.audioContext
      this.mic = input.mic

      this.scriptNode = setupAudioProcess(this.context, this.mic, this.detector)

    } else if (this.context.state === 'suspended') {
      await this.context.resume()
    }

    this.isActive = true
    console.log('Audio Detection Enabled')

  }

  async disable () {
    this.refresh = false

    await this.context.close()
    this.context = null

    this.stats.teardown() // hide stats page
    this.isActive = false
    console.log('Audio Detection Disabled')
  }

  getPitchName (pitch) {
    return this.baseKey.getRepresentation(pitch).name + (Math.floor(pitch / 12) - 1)
  }

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
        this.app.compareNote(pitch)
        this.currentPitch = pitch
        this.pitchConsumed = true

        this.stats.lastValidNote = pitchName
        this.stats.lastConfidence = confidence
        this.stats.lastLevel = amplitude
      }
    }
    else if (amplitude < noiseFloor) {
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
