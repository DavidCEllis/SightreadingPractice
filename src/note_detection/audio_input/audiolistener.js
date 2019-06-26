/**
 * This file holds the main class that handles note detection for the audio input mode
 *
 * Exposing the same functionality as the midi input with the addition of
 * audio input processing statistics.
 */

import { keyList } from '../../music_theory/keys'
import AudioStatsDisplay from './statsdisplay'
import freqToMidi from './freqtomidi'


class AUDIOListener {
  constructor () {
    this.currentPitch = null
    this.pitchConsumed = false

    this.app = null
    this.config = null
    this.stats = null

    this.refresh = null

    // Bind things in constructor
    this.beginDetection = this.beginDetection.bind(this)
    this.getPitch = this.getPitch.bind(this)
    this.updatePitch = this.updatePitch.bind(this)
  }

  enable (app, statsdiv = null) {
    this.app = app
    this.config = this.app.config
    if (statsdiv) {
      this.stats = new AudioStatsDisplay(statsdiv)
      this.stats.setup()
    }

    this.refresh = true



  }

  disable () {
    console.log('Audio Detection Disabled')
    this.refresh = false

  }

  comparePitch (pitchResult) {
    if (pitchResult.confidence > this.config.minConfidence) {
      let midiFreq = freqToMidi(pitchResult.frequency, this.config.pitchDetune)

    }
  }

  get isActive () {
    return false
  }

}
