import { Flow } from 'vexflow'
import { keyList } from './music_theory/keys.es6'
import { MusicNote } from './musicnote.es6'

var VF = Flow

class MusicBar {
  constructor (clef, key, timeSignature = '4/4') {
    /**
     * @param clef - name of clef for rendering
     * @param key - name of key
     * @param timeSignature - time signature of bar (will be used to work out how to 'fill' a bar)
     */
    this.clef = clef
    this.key = keyList[key]
    this.timeSignature = timeSignature
    this.notes = []
    this.beams = null
    this.stave = null
  }
  generateNotes (prng, lowestNote, highestNote, maxInterval, durations, accidentalRate = 0, lastNote = null) {
    // DURATIONS OTHER THAN QUARTER NOTES NOT CURRENTLY SUPPORTED
    let activeAccidentals = {} // 'base note name: n/#/b/##/bb (natural/sharp/flat)'
    let minVal, maxVal

    for (let i = 0; i < 4; i++) { // 4 quarter notes for now
      let note, notePitch, noteDuration
      let validNotes

      if (lastNote === null) {
        minVal = lowestNote
        maxVal = highestNote
      } else {
        minVal = Math.max(lowestNote, lastNote - maxInterval)
        maxVal = Math.min(highestNote, lastNote + maxInterval)
      }

      let chooseAccidental = prng.randReal()
      if (chooseAccidental >= accidentalRate) {
        // Choose a natural note - filtered by the range given
        validNotes = this.key.midiValues.naturals.filter(val => (val >= minVal && val <= maxVal))
      } else {
        validNotes = this.key.midiValues.accidentals.filter(val => (val >= minVal && val <= maxVal))
      }
      notePitch = prng.randomFrom(validNotes)
      noteDuration = prng.randomFrom(durations)
      note = new MusicNote(notePitch, this.key, noteDuration, this.clef)

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
