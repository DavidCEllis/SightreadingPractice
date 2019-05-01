import { keyList } from './music_theory/keys.es6'
import { ValidationError } from './errors.es6'

class AppConfig {
  constructor () {
    // Musical settings config
    this.key = 'C'
    this.clef = 'treble'
    this.timesignature = '4/4'
    this.durations = ['q']
    this.maxPitch = 81
    this.minPitch = 57
    this.maxInterval = 12
    this.accidentalfreq = 0.1

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
      this.key = key
    } else {
      throw new ValidationError('Key ' + key + ' does not have a definition in the keylist')
    }
  }
}

export { AppConfig }
