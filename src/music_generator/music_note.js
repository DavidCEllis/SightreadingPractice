/**
 * Class to define a musical note
 *
 * Used to handle and store information about a single note
 */

import Vex from 'vexflow'

const VF = Vex.Flow

class MusicNote {
  /**
   * Handle the details of a single note
   *
   * @param pitch - note pitch as an integer
   * @param duration - note duration
   * @param config - Application configuration
   */
  constructor (pitch, duration, config) {
    this.pitch = pitch
    this.duration = duration
    this.config = config

    this.vexElement = null
    this.divID = null
    this.played = false
    this.correct = null

    this.flow()
  }

  /**
   * Detailed note representation object with name/key/keyletter/accidental
   */
  get noteRepr () {
    return this.config.key.getRepresentation(this.pitch)
  }

  /**
   * Shortcut for note name (EG: 'C#' for 'C#4')
   */
  get noteName () {
    return this.noteRepr.name
  }

  /**
   * Shortcut for note letter (EG: 'C' for 'C#4')
   */
  get noteLetter () {
    return this.noteRepr.noteLetter
  }

  /**
   * Octave number for note (EG 4 for 'C4')
   */
  get noteRange () {
    let noteRange = Math.floor(this.pitch / 12) - 1
    if (this.noteName === 'Cb') {
      noteRange++
    } else if (this.noteName === 'B#') {
      noteRange--
    }
    return noteRange
  }

  /**
   * Accidental for note (EG: '#' for 'C#4')
   */
  get accidental () {
    return this.noteRepr.accidental
  }

  /**
   * Boolean true/false if the note is in the current key
   */
  get inKey () {
    return this.noteRepr.inKey
  }

  /**
   * Key with pitch representation for Vexflow output generation
   * EG ('C#/4' for 'C#4')
   */
  get keyPitch () {
    return this.noteName + '/' + this.noteRange
  }

  /**
   * Generate the vexFlow element for this note
   */
  flow () {
    let vexOut = new VF.StaveNote({
      keys: [this.keyPitch],
      duration: this.duration,
      clef: this.config.clef
    })

    // Side effect - store element data in class
    this.vexElement = vexOut
    this.divID = 'vf-' + vexOut.attrs.id
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
   * @param midiNote - midi value of note to compare
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
        this.vexElement.setStyle(this.config.correctStyle)
      } else {
        this.vexElement.setStyle(this.config.incorrectStyle)
      }
      this.played = true
    }
  }
}

export { MusicNote }
