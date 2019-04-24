// Generate random musical data based on given rules
import { MersenneTwister } from './mersennetwister.es6'
import { ValidationError } from '../errors.es6'
import { MusicNote } from '../musicnote.es6'
import keyList from '../music_theory/keys.es6'

class MusicGenerator {
  constructor (seed, key = 'C') {
    this.prng = new MersenneTwister(seed)
    this.key = keyList[key]
  }
  musicGen (barCount, lowestNote, highestNote, maxInterval, durations, accidentals = false) {
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

    let noteCount = barCount * 4

    let noteList = []
    let note = null
    let notePitch = null
    let noteDuration = null

    for (let i = 0; i < noteCount; i++) {
      let minVal, maxVal
      // Get range for next note
      if (notePitch === null) {
        minVal = lowestNote
        maxVal = highestNote
      } else {
        minVal = Math.max(lowestNote, notePitch - maxInterval)
        maxVal = Math.min(highestNote, notePitch + maxInterval)
      }
      // Create a new note value and add it to the list
      noteDuration = durations[this.prng.randomBetween(0, durations.length - 1)]

      notePitch = this.prng.randomBetween(minVal, maxVal)
      note = new MusicNote(notePitch, noteDuration)

      noteList.push(note)
    }
    return noteList
  }
}

export { MusicGenerator }
