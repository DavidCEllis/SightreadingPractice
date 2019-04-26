/*
  Class to define a musical note

  Used to handle and store information about a single note
*/

import { Flow } from 'vexflow'
import { keyList } from './music_theory/keys.es6'

var VF = Flow

// These colors are bad and should be changed!
const correctNoteColor = 'blue'
const incorrectNoteColor = 'tomato'

const correctStyle = { fillStyle: correctNoteColor, strokeStyle: correctNoteColor }
const incorrectStyle = { fillStyle: incorrectNoteColor, strokeStyle: incorrectNoteColor }

class MusicNote {
  /**
   * Handle the details of a single note
   *
   * @param pitch - note pitch as an integer
   * @param key - Musical key for the pitch (changes representation)
   * @param duration - note duration
   * @param clef - Musical Clef to display the pitch
   */
  constructor (pitch, key = 'C', duration = 'q', clef = 'treble') {
    this.pitch = pitch
    this.duration = duration
    this.clef = clef
    this.key = keyList[key]

    let noteRepr = key.getRepresentation(pitch)

    this.noteName = noteRepr.name // Basic note name (eg: 'C#')
    this.noteLetter = noteRepr.noteLetter // base letter (eg 'C' for 'C#')
    this.noteRange = Math.floor(this.pitch / 12) - 1 // Octave range (eg: 4 for C4)
    this.accidental = noteRepr.accidental // '#'/'b'/'n' etc accidental representation
    this.inKey = noteRepr.inKey // true / false is note in key
    this.keyPitch = this.noteName + '/' + this.noteRange

    this.vexElement = null
    this.divID = null
    this.played = false
    this.correct = null

    this.flow()
  }
  flow () {
    let vexOut = new VF.StaveNote({
      keys: [this.keyPitch],
      duration: this.duration,
      clef: this.clef
    })

    // Side effect - store element data in class
    this.vexElement = vexOut
    this.divID = vexOut.attrs.id
  }
  renderAccidental () {
    /**
     * Instruct vexFlow to render the accidental of this note
     */
    if (this.vexElement) {
      this.vexElement = this.vexElement.addAccidental(0, new VF.Accidental(this.accidental))
    }
  }
  isEqualTo (midiNote) {
    return this.pitch === midiNote
  }
  playNote (notePitch) {
    if (this.vexElement) {
      this.correct = this.isEqualTo(notePitch)
      if (this.correct) {
        this.vexElement.setStyle(correctStyle)
      } else {
        this.vexElement.setStyle(incorrectStyle)
      }
      this.played = true
    }
  }
}

export { MusicNote }
