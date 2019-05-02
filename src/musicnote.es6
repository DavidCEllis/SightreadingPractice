/**
 * Class to define a musical note
 *
 * Used to handle and store information about a single note
 */

import { Flow } from 'vexflow'

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
   * @param duration - note duration
   * @param key - Instance of key (changes representation)
   * @param clef - Musical Clef to display the pitch
   */
  constructor (pitch, duration, key, clef = 'treble') {
    this.pitch = pitch
    this.duration = duration
    this.key = key
    this.clef = clef

    let noteRepr = key.getRepresentation(pitch)

    this.noteName = noteRepr.name // Basic note name (eg: 'C#')
    this.noteLetter = noteRepr.noteLetter // base letter (eg 'C' for 'C#')
    this.noteRange = Math.floor(this.pitch / 12) - 1 // Octave range (eg: 4 for C4)

    /* B# and Cb are special cases
     * eg: B#4 is C5, B3 is Cb4
     * As the numbers come from the absolute pitch these notes need to be adjusted
     */
    if (this.noteName === 'Cb') {
      this.noteRange++
    } else if (this.noteName === 'B#') {
      this.noteRange--
    }
    this.accidental = noteRepr.accidental // '#'/'b'/'n' etc accidental representation
    this.inKey = noteRepr.inKey // true / false is note in key
    this.keyPitch = this.noteName + '/' + this.noteRange

    this.vexElement = null
    this.divID = null
    this.played = false
    this.correct = null

    this.flow()
  }
  /**
   * Generate the vexFlow element for this note
   */
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
  /**
   * Instruct vexFlow to render the accidental of this note
   */
  renderAccidental () {
    if (this.vexElement) {
      this.vexElement = this.vexElement.addAccidental(0, new VF.Accidental(this.accidental))
    }
  }
  /**
   * Compare a given numerical midi note value to the value of this note
   * (Not used to compare two instances of the class)
   *
   * @param midiNote {integer} - midi value of note to compare
   */
  isEqualTo (midiNote) {
    return this.pitch === midiNote
  }
  /**
   * 'Play' this note in a score - determine if it has been played correctly and style appropriately
   *
   * @param notePitch - midi note value of note that has been 'played'
   */
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
