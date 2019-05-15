// Generate random musical data based on given rules
import { MersenneTwister } from './mersennetwister.es6'
import { MusicBar } from './musicbar.es6'

class MusicGenerator {
  constructor (seed, config) {
    this.prng = new MersenneTwister(seed)
    this.config = config
  }
  musicGen () {
    /*
      Generate barCount bars of 4/4 quarter notes
      Between lowestNote and highestNote with the largest jump of maxInterval

      Initial naive version
    */
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
