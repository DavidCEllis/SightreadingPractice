/*
  Class to define a musical note

  Used to convert from our internal representation to one required by vexflow
  Done to keep vexflow code out of the music generation
*/

import { Flow } from 'vexflow'

var VF = Flow

const noteMap = [ // Map midi index to notes, kind of arbitrary ordering more/less common names
  ['C', 'B#', 'Dbb'],
  ['C#', 'Db', 'B##'],
  ['D', 'C##', 'Ebb'],
  ['Eb', 'D#', 'Fbb'],
  ['E', 'Fb', 'D##'],
  ['F', 'E#', 'Gbb'],
  ['F#', 'Gb', 'E##'],
  ['G', 'F##', 'Abb'],
  ['Ab', 'G#'],
  ['A', 'G##', 'Bbb'],
  ['Bb', 'A#', 'Cbb'],
  ['B', 'Cb', 'A##']
]

class MusicNote {
  /**
   *
   * @param pitch note pitch as an integer
   * @param duration note duration
   */
  constructor (pitch, duration = 'q', clef = 'treble') {
    this.pitch = pitch
    this.duration = duration
    this.clef = clef
  }
  keypitch () {
    /**
     * Convert the midi pitch value to a note name
     */
    let noteName = noteMap[this.pitch % 12][0]
    let noteRange = Math.floor(this.pitch / 12) - 1
    return noteName + '/' + noteRange
  }
  flow () {
    let keyName = this.keypitch()
    let vexOut = new VF.StaveNote({
      keys: [keyName],
      duration: this.duration,
      clef: this.clef
    })
    // Add sharp or flat indicator
    if (keyName.includes('#')) {
      vexOut = vexOut.addAccidental(0, new VF.Accidental('#'))
    } else if (keyName.includes('b')) {
      vexOut = vexOut.addAccidental(0, new VF.Accidental('b'))
    }
    return vexOut
  }
}

export { MusicNote }
