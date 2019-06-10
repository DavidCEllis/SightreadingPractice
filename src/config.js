import { keyList } from './music_theory/keys'
import { CodingError, ValidationError } from './errors'

class AppConfig {
  constructor (settings = {}) { // {} evaluated at call time - this is not python!
    // Default Config Settings
    // Musical settings config
    this.keyName = settings.keyName || 'C'
    this.clef = settings.clef || 'treble'
    this.timeSignature = settings.timeSignature || '4/4'
    this.durations = settings.durations || ['q']
    this.highestNote = settings.highestNote || 81
    this.lowestNote = typeof settings.lowestNote !== 'undefined' ? settings.lowestNote : 57 // Can be 0
    this.maxInterval = settings.maxInterval || 12
    this.accidentalFreq = typeof settings.accidentalFreq !== 'undefined' ? settings.accidentalFreq : 0.1

    this.transposition = settings.transposition || 0 // transposition up from actual pitch

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

    this.correctColor = settings.correctColor || 'blue' // Colour for correctly played notes
    this.incorrectColor = settings.incorrectColor || 'tomato' // Colour for incorrectly played notes

    //
    this.detectionMode = 'MIDI' // settings.detectionMode || 'MIDI'

    // Audio Settings
    this.audioNoiseFloor = settings.audioNoiseFloor || 0.005 // Noise floor (used to reset detection)
    this.audioMinAmplitude = settings.audioMinAmplitude || 0.010 // Minimum amplitude of a note to trigger detection
    this.amplitudeSmoothing = typeof settings.amplitudeSmoothing !== 'undefined' ? settings.amplitudeSmoothing : .8
    this.pitchDetune = settings.pitchDetune || 20 // Detune +/- in cents detected as a pitch
    this.minConfidence = settings.minConfidence || 0.75 // Actually has to be > 0.5 anyway
  }

  get settings () {
    return {
      'keyName': this.keyName,
      'clef': this.clef,
      // 'timeSignature': this.timeSignature,
      // 'durations': this.durations,
      'highestNote': this.highestNote,
      'lowestNote': this.lowestNote,
      // 'maxInterval': this.maxInterval,
      'accidentalFreq': this.accidentalFreq,
      'transposition': this.transposition,
      'correctColor': this.correctColor,
      'incorrectColor': this.incorrectColor,
      'detectionMode': this.detectionMode,
      'audioNoiseFloor': this.audioNoiseFloor,
      'audioMinAmplitude': this.audioMinAmplitude,
      // 'amplitudeSmoothing': this.amplitudeSmoothing,
      // 'pitchDetune': this.pitchDetune,
      'minConfidence': this.minConfidence
    }
  }

  /**
   * @param keyName {string} - musical key (EG: 'C' or 'Em')
   */
  set keyName (keyName) {
    if (keyName in keyList) {
      this._keyName = keyName
      this._key = keyList[keyName]
    } else {
      throw new ValidationError('Key ' + keyName + ' does not have a definition in the keylist')
    }
  }

  get keyName () {
    return this._keyName
  }

  // noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
  set key (unused) {
    throw new CodingError('Key should be set by using "keyName = ..." and not set directly')
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

  // noinspection JSMethodCanBeStatic
  /**
   * Shortcut for names of keys
   */
  get keyNames () {
    return Object.keys(keyList)
  }

  get correctStyle () {
    return { fillStyle: this.correctColor, strokeStyle: this.correctColor }
  }

  get incorrectStyle () {
    return { fillStyle: this.incorrectColor, strokeStyle: this.incorrectColor }
  }
}

export { AppConfig }
