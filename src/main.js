import Vex from 'vexflow'

import { AppConfig } from './config'
import { MusicGenerator } from './music_generator/music_gen'
import { InitializationError } from './errors'

const VF = Vex.Flow

class MainApp {
  constructor (div, seed = Date.now(), settings = {}) {
    this.div = div
    this.seed = seed

    this.config = new AppConfig(settings)

    this.renderer = new VF.Renderer(this.div, VF.Renderer.Backends.SVG)

    // Handle elements for SVG generation/regeneration
    this.renderer.resize(this.config.rendererWidth, this.config.rendererHeight)
    this.context = this.renderer.getContext()
    this.svgTag = this.div.getElementsByTagName('svg')[0]

    // Details for the current state/notes
    // this.staves = []
    this.bars = null
    // this.vexNotes = null

    this.currentBarIndex = 0 // Index of currently played bar
    this.currentNoteIndex = 0 // Index of currently played note in bar

    // Get our PRNG for the app
    this.generator = new MusicGenerator(this.seed, this.config)
  }

  generateMusic () {
    /**
     * Generate the music for this application
     */
    this.bars = this.generator.musicGen()
    // Reset indices
    this.currentBarIndex = 0
    this.currentNoteIndex = 0
  }

  /**
   * Clear and redraw the complete score in the SVG element
   */
  draw () {
    if (this.bars === null) {
      throw new InitializationError('Attempted to draw staves before generating notes.')
    }

    // Clear any currently drawn music
    this.svgTag.innerHTML = ''

    // Generate the staves and their positions
    for (let i = 0; i < this.bars.length; i++) {
      // Work out horizontal and vertical positioning for bars
      let hpos = this.config.hstart + (i % this.config.barsPerLine) * this.config.hoffset
      let vpos = this.config.vstart + Math.floor(i / this.config.barsPerLine) * this.config.voffset

      // Generate stave for bar
      this.bars[i].makeStave(hpos, vpos, this.config.hoffset)

      // Display clef on each new line, time signature on first line
      if ((i % this.config.barsPerLine) === 0) {
        this.bars[i].stave.addClef(this.config.clef).addKeySignature(this.config.keyName)
        if (i === 0) {
          this.bars[i].stave.addTimeSignature(this.config.timeSignature)
        }
      }
      this.bars[i].stave.setContext(this.context).draw()
    }

    // Handle drawing each 'stave' (bar)
    for (let i = 0; i < this.bars.length; i++) {
      let stave = this.bars[i].stave
      let vexNotes = this.bars[i].notes.map(note => note.vexElement)
      VF.Formatter.FormatAndDraw(this.context, stave, vexNotes)
      this.bars[i].beams.forEach(beam => beam.setContext(this.context).draw())
    }
  }

  /**
   * Compare an input midi value to the current note in the score
   * @param inputVal { number } - integer note number (based on midi numbers)
   *
   * Updates the notes internal state to played and correct/incorrect.
   *
   * Advances to the next note and redraws and generates a new score if
   * the current score has been completed.
   */
  compareNote (inputVal) {
    // Apply Transposition
    let noteVal = inputVal + this.config.transposition

    if (this.currentBarIndex < this.bars.length) {
      let currentNote = this.bars[this.currentBarIndex].notes[this.currentNoteIndex]
      currentNote.playNote(noteVal)
      this.currentNoteIndex++
      if (this.currentNoteIndex >= this.bars[this.currentBarIndex].notes.length) {
        // Finished a bar, move to the next
        this.currentBarIndex++
        this.currentNoteIndex = 0
      }
      // Just update the draw for the current note
      this.updateNote(currentNote)
    } else {
      // We have played all bars and 1 extra note, time to reset
      this.generateMusic()
      this.draw()
    }
  }

  /**
   * Alter the display for the given note to match correct/incorrect status
   *
   * @param note { MusicNote } - note to redraw and update
   */
  updateNote (note) {
    let noteElement = this.svgTag.getElementById(note.divID)
    let noteStyle = note.correct ? this.config.correctStyle : this.config.incorrectStyle

    let stem = noteElement.getElementsByTagName('path')[0]
    let noteHead = noteElement.getElementsByTagName('path')[1]

    stem.setAttribute('stroke', noteStyle.strokeStyle)
    noteHead.setAttribute('fill', noteStyle.fillStyle)
  }
}

export default MainApp
