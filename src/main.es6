import { Flow } from 'vexflow'
import { MusicGenerator } from './music_generator/musicgen.es6'
import { InitializationError } from './errors.es6'

var VF = Flow

class MainApp {
  constructor (div, seed = Date.now()) {
    this.div = div
    this.seed = seed

    this.renderer = new VF.Renderer(this.div, VF.Renderer.Backends.SVG)

    // Handle elements for SVG generation/regeneration
    this.renderer.resize(1400, 800)
    this.context = this.renderer.getContext()
    this.svgTag = this.div.getElementsByTagName('svg')[0]

    // Get our PRNG for the app
    this.generator = new MusicGenerator(this.seed)

    // Details for the current state/notes
    this.staves = []
    this.bars = null
    this.notes = null
    this.vexNotes = null
    this.currentIndex = 0 // Index of currently played note

    // Drawing values
    this.barsPerLine = 4
    this.hstart = 10
    this.vstart = 40

    this.hoffset = 300
    this.voffset = 125

    // Currently fixed to treble clef and 4/4 - will eventually need to be more flexible
    this.clef = 'treble'
    this.timeSignature = '4/4'
  }
  generateNotes (bars = 16, minPitch = 57, maxPitch = 88, maxInterval = 12) {
    /**
     * Generate the music for this application
     * @param bars - Number of bars of music to generate (default: 16)
     * @param minPitch - Midi integer value of lowest pitch to generate (default: 57)
     * @param maxPitch - Midi integer value of highest pitch to generate (default: 88)
     * @param maxInterval - Largest possible interval jump to generate in semitones (default: 12)
     */
    this.bars = bars
    this.notes = this.generator.musicGen(bars, minPitch, maxPitch, maxInterval, ['q'])
    this.vexNotes = this.notes.map(note => note.flow())
    this.beams = VF.Beam.generateBeams(this.vexNotes)
  }
  draw () {
    /**
     * Draw the current music stored in this.notes
     */

    if (this.notes === null) {
      throw new InitializationError('Attempted to draw staves before generating notes.')
    }

    // Clear div
    this.svgTag.innerHTML = ''

    for (let i = 0; i < this.bars; i++) {
      let hpos = this.hstart + (i % this.barsPerLine) * this.hoffset
      let vpos = this.vstart + Math.floor(i / this.barsPerLine) * this.voffset
      let stave = new VF.Stave(hpos, vpos, this.hoffset)
      if ((i % this.barsPerLine) === 0) {
        stave.addClef(this.clef)
        if (i === 0) { stave.addTimeSignature(this.timeSignature) }
      }
      stave.setContext(this.context).draw()
      this.staves.push(stave)
    }
    // Create a stave at position 10, 40 of width 400 on the canvas.

    for (let i = 0; i < this.staves.length; i++) {
      VF.Formatter.FormatAndDraw(this.context, this.staves[i], this.vexNotes.slice(i * 4, i * 4 + 4))
    }
    this.beams.forEach(beam => beam.setContext(this.context).draw())
  }
  compareNote (inputVal) {
    if (this.currentIndex < this.notes.length) {
      let currentNote = this.notes[this.currentIndex]
      currentNote.playNote(inputVal)
      this.currentIndex++
    }
    if (this.currentIndex % 4 === 0) { // Compare if we have finished a bar, redraw (basic version)
      this.draw()
    }
  }
}

export default MainApp
