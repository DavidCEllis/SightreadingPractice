import { Flow } from 'vexflow'

import { MusicNote } from './musicnote.es6'

const VF = Flow

class MusicBar {
  constructor (config) {
    /**
     * @param config - global config
     */
    this.config = config

    this.notes = []
    this.beams = null
    this.stave = null
  }

  generateNotes (prng, lastNote = null) {
    // DURATIONS OTHER THAN QUARTER NOTES NOT CURRENTLY SUPPORTED
    let activeAccidentals = {} // 'base note name: n/#/b/##/bb (natural/sharp/flat)'
    let minVal, maxVal

    for (let i = 0; i < 4; i++) { // 4 quarter notes for now
      let note, notePitch, noteDuration
      let validNotes

      if (lastNote === null) {
        minVal = this.config.lowestNote
        maxVal = this.config.highestNote
      } else {
        minVal = Math.max(this.config.lowestNote, lastNote - this.config.maxInterval)
        maxVal = Math.min(this.config.highestNote, lastNote + this.config.maxInterval)
      }

      let chooseAccidental = prng.randomReal()
      if (chooseAccidental >= this.config.accidentalFreq) {
        // Choose a natural note - filtered by the range given
        validNotes = this.config.key.midiValues.naturals.filter(val => (val >= minVal && val <= maxVal))
      } else {
        validNotes = this.config.key.midiValues.accidentals.filter(val => (val >= minVal && val <= maxVal))
      }
      notePitch = prng.randomFrom(validNotes)
      noteDuration = prng.randomFrom(this.config.durations)

      note = new MusicNote(notePitch, noteDuration, this.config)

      // Handle conditions under which to render accidentals
      // Case 1: Note in key but accidental used earlier
      // Case 2: Note not in key and accidental not used earlier
      if (activeAccidentals[note.noteLetter + note.noteRange] && note.inKey) {
        note.renderAccidental()
        delete activeAccidentals[note.noteLetter + note.noteRange]
      } else if (!note.inKey) {
        if (activeAccidentals[note.noteLetter + note.noteRange] !== note.accidental) {
          note.renderAccidental()
          activeAccidentals[note.noteLetter + note.noteRange] = note.accidental
        }
      }
      this.notes.push(note)
      lastNote = notePitch
    }
    return lastNote
  }

  makeStave (hpos, vpos, hoffset) {
    // Make Beams
    let vexNotes = this.notes.map(note => note.vexElement)
    this.beams = VF.Beam.generateBeams(vexNotes)

    // Make Stave
    this.stave = new VF.Stave(hpos, vpos, hoffset)
    return this.stave
  }
}

export { MusicBar }
