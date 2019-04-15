// Generate random musical data based on given rules
import { MersenneTwister } from './mersennetwister.js'
import { ValidationError } from './errors.es6'

class MusicGenerator {
  constructor (seed) {
    this.prng = MersenneTwister(seed)
  }
  musicGen (barCount, lowestNote, highestNote, maxInterval) {
    /*
      Generate barCount bars of 4/4 quarter notes
      Between lowestNote and highestNote with the largest jump of maxInterval

      Initial naive version
    */

    // Some basic validation
    if (!Number.isInteger(barCount) || !Number.isInteger(lowestNote) || !Number.isInteger(highestNote) || !Number.isInteger(maxInterval)) {
      throw ValidationError('All input parameters must be positive integers.')
    } else if (barCount < 0 || maxInterval < 0) {
      throw ValidationError('All input parameters must be positive integers.')
    } else if (lowestNote < 0 || lowestNote > 127) {
      throw ValidationError('Lowest Note ' + lowestNote + ' is out of range. Should be a number between 0 and 127.')
    } else if (highestNote < 0 || highestNote > 127) {
      throw ValidationError('Highest Note ' + highestNote + ' is out of range. Should be a number between 0 and 127.')
    } else if (lowestNote >= highestNote) {
      throw ValidationError('Lowest note must be strictly lower than highest note')
    }

    let noteCount = barCount * 4
    let noteList = []

    let note = this.prng.randomBetween(lowestNote, highestNote)

    noteList.push(note)

    for (let i = 1; i < noteCount; i++) {
      // Get range for next note
      let minVal = Math.max(lowestNote, note - maxInterval)
      let maxVal = Math.min(highestNote, note + maxInterval)

      // Create a new note value and add it to the list
      note = this.prng.randomBetween(minVal, maxVal)
      noteList.push(note)
    }
  }
}

export { MusicGenerator }
