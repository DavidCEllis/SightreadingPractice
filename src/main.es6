import { Flow } from 'vexflow'
import { MusicGenerator } from './music_generator/musicgen.es6'
import { InitializationError } from './errors.es6'

var VF = Flow

class MainApp {
  constructor (div, seed = Date.now(), key = 'C', clef = 'treble', timeSignature = '4/4') {
    this.div = div
    this.seed = seed

    this.renderer = new VF.Renderer(this.div, VF.Renderer.Backends.SVG)

    // Handle elements for SVG generation/regeneration
    this.renderer.resize(1400, 800)
    this.context = this.renderer.getContext()
    this.svgTag = this.div.getElementsByTagName('svg')[0]

    // Details for the current state/notes
    this.staves = []
    this.barCount = null
    this.bars = null
    this.vexNotes = null

    this.currentBarIndex = 0 // Index of currently played bar
    this.currentNoteIndex = 0 // Index of currently played note in bar

    // Drawing values
    this.barsPerLine = 4
    this.hstart = 10
    this.vstart = 40

    this.hoffset = 300
    this.voffset = 125

    // Currently fixed to treble clef and 4/4 - will eventually need to be more flexible
    this.key = key
    this.clef = clef
    this.timeSignature = timeSignature

    // Get our PRNG for the app
    this.generator = new MusicGenerator(this.seed, this.key, this.clef, this.timeSignature)
  }
  generateMusic (barCount = 16, minPitch = 57, maxPitch = 88, maxInterval = 12) {
    /**
     * Generate the music for this application
     * @param barCount - Number of bars of music to generate (default: 16)
     * @param minPitch - Midi integer value of lowest pitch to generate (default: 57)
     * @param maxPitch - Midi integer value of highest pitch to generate (default: 88)
     * @param maxInterval - Largest possible interval jump to generate in semitones (default: 12)
     */
    this.barCount = barCount
    this.bars = this.generator.musicGen(barCount, minPitch, maxPitch, maxInterval, ['q'], 0.1)
  }
  draw () {
    /**
     * Draw the current music stored in this.notes
     */

    if (this.bars === null) {
      throw new InitializationError('Attempted to draw staves before generating notes.')
    }

    // Clear any currently drawn music
    this.svgTag.innerHTML = ''

    // Generate the staves and their positions
    for (let i = 0; i < this.bars.length; i++) {
      let hpos = this.hstart + (i % this.barsPerLine) * this.hoffset
      let vpos = this.vstart + Math.floor(i / this.barsPerLine) * this.voffset

      // Generate stave for bar
      this.bars[i].makeStave(hpos, vpos, this.hoffset)

      // Display clef on each new line, time signature on first line
      if ((i % this.barsPerLine) === 0) {
        this.bars[i].stave.addClef(this.clef)
        if (i === 0) { this.bars[i].stave.addTimeSignature(this.timeSignature) }
      }
      this.bars[i].stave.setContext(this.context).draw()
    }

    // Handle drawing each 'stave' (bar)
    for (let i = 0; i < this.bars.length; i++) {
      let stave = this.bars[i].stave
      let vexNotes = this.bars[i].notes.map(note => note.vexElement)
      VF.Formatter.FormatAndDraw(this.context, stave, vexNotes)
    }
    let beams = this.bars.map(bar => bar.beams)
    beams.forEach(beam => beam.setContext(this.context).draw())
  }
  compareNote (inputVal) {
    if (this.currentBarIndex < this.barCount) {
      let currentNote = this.bars[this.currentBarIndex].notes[this.currentNoteIndex]
      currentNote.playNote(inputVal)
      this.currentNoteIndex++
    }
    if (this.currentNoteIndex >= this.bars[this.currentBarIndex].notes.length) {
      // Finished a bar, move to the next and draw the next bar
      this.currentBarIndex++
      this.currentNoteIndex = 0
      this.draw()
    }
  }
}

export default MainApp
