import { Flow } from 'vexflow'
import { MusicGenerator } from './musicgen.es6'

var VF = Flow

// Create an SVG renderer and attach it to the DIV element named "boo".
var div = document.getElementById('vexflow')

var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG)

// Size our svg:
renderer.resize(500, 500)

// And get a drawing context:
var context = renderer.getContext()

// Create a stave at position 10, 40 of width 400 on the canvas.
var stave = new VF.Stave(10, 40, 400)

// Add a clef and time signature.
stave.addClef('treble').addTimeSignature('4/4')

// Connect it to the rendering context and draw!
stave.setContext(context).draw()

var mg = new MusicGenerator(561841234)

var notes = mg.musicGen(2, 60, 96, 12, ['q'])

var vexNotes = notes.map(note => note.flow())

VF.Formatter.FormatAndDraw(context, stave, vexNotes)
