// Generate random musical data based on given rules
import { MersenneTwister } from './mersennetwister.es6'
import { ValidationError } from '../errors.es6'
import { MusicBar } from '../MusicBar.es6'

class MusicGenerator {
  constructor (seed, key = 'C', clef = 'treble', timeSignature = '4/4') {
    this.prng = new MersenneTwister(seed)
    this.key = key
    this.clef = clef
    this.timeSignature = timeSignature
  }
  musicGen (barCount, lowestNote, highestNote, maxInterval, durations, accidentalRate = 0) {
    /*
      Generate barCount bars of 4/4 quarter notes
      Between lowestNote and highestNote with the largest jump of maxInterval

      Initial naive version
    */

    // Some basic validation
    if (!Number.isInteger(barCount) || !Number.isInteger(lowestNote) || !Number.isInteger(highestNote) || !Number.isInteger(maxInterval)) {
      throw new ValidationError('All input parameters must be positive integers.')
    } else if (barCount < 0 || maxInterval < 0) {
      throw new ValidationError('All input parameters must be positive integers.')
    } else if (lowestNote < 0 || lowestNote > 127) {
      throw new ValidationError('Lowest Note ' + lowestNote + ' is out of range. Should be a number between 0 and 127.')
    } else if (highestNote < 0 || highestNote > 127) {
      throw new ValidationError('Highest Note ' + highestNote + ' is out of range. Should be a number between 0 and 127.')
    } else if (lowestNote >= highestNote) {
      throw new ValidationError('Lowest note must be strictly lower than highest note')
    } else if (!Array.isArray(durations)) {
      throw new ValidationError('Durations must be an array of possible durations.')
    }

    let bars = []
    let lastNote = null

    for (let i = 0; i < barCount; i++) {
      let currentBar = new MusicBar(this.clef, this.key, this.timeSignature)
      lastNote = currentBar.generateNotes(
        this.prng, lowestNote, highestNote, maxInterval, durations, accidentalRate, lastNote
      )
      bars.push(currentBar)
    }

    return bars
  }
}

export { MusicGenerator }
