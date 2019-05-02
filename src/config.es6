import { keyList } from './music_theory/keys.es6'
import { ValidationError } from './errors.es6'

class AppConfig {
  constructor () {
    // Musical settings config
    this.key = 'C'
    this.clef = 'treble'
    this.timeSignature = '4/4'
    this.durations = ['q']
    this.highestNote = 81
    this.lowestNote = 57
    this.maxInterval = 12
    this.accidentalFreq = 0.1

    // General settings config
    this.barCount = 16

    // Visual settings config
    this.rendererWidth = 1400
    this.rendererHeight = 600
    this.barsPerLine = 4
    this.hstart = 10
    this.vstart = 40
    this.hoffset = 300
    this.voffset = 125
  }
  /**
   * @param key {string} - musical key (EG: 'C' or 'Em')
   */
  set key (key) {
    if (key in keyList) {
      this._key = keyList[key]
    } else {
      throw new ValidationError('Key ' + key + ' does not have a definition in the keylist')
    }
  }
  get key () {
    return this._key
  }
  /**
   * @param barCount {number} - number of bars of music to generate
   */
  set barCount (barCount) {
    if (!Number.isInteger(barCount) || barCount < 0) {
      throw new ValidationError('Bar count must be a positive integer.')
    } else {
      this._barCount = barCount
    }
  }
  get barCount () {
    return this._barCount
  }
  /**
   * @param lowestNote {number} - midi value of the lowest possible note to generate
   */
  set lowestNote (lowestNote) {
    if (!Number.isInteger(lowestNote) || lowestNote < 0 || lowestNote > 127) {
      throw new ValidationError('Lowest Note ' + lowestNote + ' is out of range. Should be an integer between 0 and 127.')
    } else if (lowestNote >= this.highestNote) {
      this._lowestNote = lowestNote
      this.highestNote = lowestNote + 12 // Add one octave from lowest note to highest note
      console.log('New lowest note defined higher than current highest note. Setting highest note one octave above.')
    } else {
      this._lowestNote = lowestNote
    }
  }
  get lowestNote () {
    return this._lowestNote
  }
  /**
   * @param highestNote {number} - midi value of the highest possible note to generate
   */
  set highestNote (highestNote) {
    if (!Number.isInteger(highestNote) || highestNote < 0 || highestNote > 127) {
      throw new ValidationError('Highest Note ' + highestNote + ' is out of range. Should be an integer between 0 and 127.')
    } else if (highestNote <= this.lowestNote) {
      this._highestNote = highestNote
      this.lowestNote = highestNote - 12
      console.log('New highest note defined lower than current lowest note. Setting lowest note one octave below.')
    } else {
      this._highestNote = highestNote
    }
  }
  get highestNote () {
    return this._highestNote
  }
  /**
   * @param maxInterval {number} - Largest interval between two consecutive notes in semitones
   */
  set maxInterval (maxInterval) {
    if (!Number.isInteger(maxInterval) || maxInterval < 0) {
      throw new ValidationError('Maximum note interval must be a positive integer.')
    } else {
      this._maxInterval = maxInterval
    }
  }
  get maxInterval () {
    return this._maxInterval
  }
  /**
   * @param accidentalFreq {number} - floating point probability that a note should be an accidental
   */
  set accidentalFreq (accidentalFreq) {
    if (isNaN(accidentalFreq) || accidentalFreq < 0 || accidentalFreq > 1) {
      throw new ValidationError('Accidental Frequency must be a floating point number between 0 and 1. Not: ' + accidentalFreq)
    } else {
      this._accidentalFreq = accidentalFreq
    }
  }
  get accidentalFreq () {
    return this._accidentalFreq
  }
  /**
   * @param durations {Array} - array of strings representing note durations
   */
  set durations (durations) {
    if (!Array.isArray(durations)) {
      throw new ValidationError('Durations must be an array of possible durations.')
    } else {
      this._durations = durations
    }
  }
  get durations () {
    return this._durations
  }
  /**
   * Shortcut for names of keys
   */
  get keyNames () {
    return Object.keys(keyList)
  }
}

export { AppConfig }
