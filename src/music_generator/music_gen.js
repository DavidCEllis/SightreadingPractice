// Generate random musical data based on given rules
import { MersenneTwister } from './mersenne_twister'
import { MusicBar } from './music_bar'

class MusicGenerator {
  /**
   * Create a music generator for a given seed and configuration
   *
   * @param seed - initial PRNG seed for MT
   * @param config - Application configuration (shared object)
   */
  constructor (seed, config) {
    this.prng = new MersenneTwister(seed)
    this.config = config
  }

  /**
   * Generate barCount bars of 4/4 quarter notes
   *
   * Between lowestNote and highestNote with the largest jump of maxInterval
   * Initial naive version
   * @returns {Array}
   */
  musicGen () {
    let bars = []
    let lastNote = null

    for (let i = 0; i < this.config.barCount; i++) {
      let currentBar = new MusicBar(this.config)
      lastNote = currentBar.generateNotes(this.prng, lastNote)
      bars.push(currentBar)
    }

    return bars
  }
}

export { MusicGenerator }
