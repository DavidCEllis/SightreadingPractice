import { Flow } from 'vexflow'
import { MusicGenerator } from './musicgen.es6'

var VF = Flow

class MainApp {
  constructor (div) {
    this.div = div
    this.renderer = new VF.Renderer(this.div, VF.Renderer.Backends.SVG)

    // Size our svg:
    this.renderer.resize(1400, 800)

    // And get a drawing context:
    this.context = this.renderer.getContext()

    this.svgTag = this.div.getElementsByTagName('svg')[0]

    this.staves = []

    this.barsPerLine = 4
    this.hstart = 10
    this.vstart = 40

    this.hoffset = 300
    this.voffset = 125

    this.clef = 'treble'
    this.signature = '4/4'

    this.group = null
  }
  draw (bars = 16, minPitch = 57, maxPitch = 88, maxInterval = 12) {
    // Clear div
    this.svgTag.innerHTML = ''

    for (let i = 0; i < bars; i++) {
      let hpos = this.hstart + (i % this.barsPerLine) * this.hoffset
      let vpos = this.vstart + Math.floor(i / this.barsPerLine) * this.voffset
      let stave = new VF.Stave(hpos, vpos, this.hoffset)
      if ((i % this.barsPerLine) === 0) {
        stave.addClef(this.clef)
        if (i === 0) { stave.addTimeSignature(this.signature) }
      }
      stave.setContext(this.context).draw()
      this.staves.push(stave)
    }
    // Create a stave at position 10, 40 of width 400 on the canvas.

    var mg = new MusicGenerator(Date.now())

    this.notes = mg.musicGen(bars, minPitch, maxPitch, maxInterval, ['q'])

    this.vexNotes = this.notes.map(note => note.flow())

    var beams = VF.Beam.generateBeams(this.vexNotes)

    for (let i = 0; i < this.staves.length; i++) {
      VF.Formatter.FormatAndDraw(this.context, this.staves[i], this.vexNotes.slice(i * 4, i * 4 + 4))
    }
    beams.forEach(beam => beam.setContext(this.context).draw())
  }
}

export default MainApp
