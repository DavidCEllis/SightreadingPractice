/**
 * This file holds the main class that handles note detection for the audio input mode
 *
 * Exposing the same functionality as the midi input with the addition of
 * audio input processing statistics.
 */

import { keyList } from '../../music_theory/keys'
import AUDIOStats from './audiostats'
import freqToMidi from './freqtomidi'


class AUDIOListener {
  constructor () {
    this.currentPitch = null
    this.pitchConsumed = false

    this.app = null
    this.stats = null

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

  }

  disable () {
    console.log('Audio Detection Disabled')
    this.refresh = false

  }

  get isActive () {
    return false
  }

  /**
   * Callback function to update the pitch detection in the app provided
   * @param err - Callback error
   * @param freq {number} - Frequency detected by model in Hz
   */
  updatePitch (err, freq) {

  }

  /**
   * getPitch
   *
   * Kick off the pitch detection and get called again in the callback
   */
  getPitch () {

  }

  beginDetection () {

    this.getPitch()
  }
}
