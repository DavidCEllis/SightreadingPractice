/*
This should deal with all the form elements and setting up and anything related to the DOM
No music generation or recognition logic should appear here.
*/

import MainApp from './main.es6'
import { midiStart } from './note_detection/midi_notes.es6'
import { keyList } from './music_theory/keys.es6'

import css from './styles/style.css'

// Get the element ID for the div to render the score
var div = document.getElementById('srt-render')

var seed = Date.now() // Use timestamp as basic RNG seed
var app = new MainApp(div, seed)

// Generation settings IDs
var clefSelect = document.getElementById('srt-clef')
var keySelect = document.getElementById('srt-key-list')
var accidentalField = document.getElementById('srt-accidentals')
var lowestNoteSelect = document.getElementById('srt-lowestnote')
var highestNoteSelect = document.getElementById('srt-highestnote')

// Detection Settings IDs
var detectMidi = document.getElementById('srt-input-midi')
var detectAudio = document.getElementById('srt-input-audio')
var noteTransposition = document.getElementById('srt-transposition')

// Add clef options to dropdown
{
  let clefOptions = ['treble', 'bass', 'alto', 'tenor']
  for (let clef of clefOptions) {
    let clefElement = document.createElement('option')
    clefElement.text = clef.charAt(0).toUpperCase() + clef.slice(1)
    clefElement.value = clef
    clefSelect.add(clefElement)
  }
}

// Add key options to dropdown
{
  let keyOptions = app.config.keyNames.map(() => document.createElement('option'))
  for (let i = 0; i < keyOptions.length; i++) {
    keyOptions[i].text = app.config.keyNames[i]
    keyOptions[i].value = app.config.keyNames[i]
    keySelect.add(keyOptions[i])
  }
}

// Add complete note range to min/max pitches
{
  let key = keyList['C']
  for (let i = 127; i >= 0; i--) {
    let noteName = key.getRepresentation(i).name
    let noteRange = Math.floor(i / 12) - 1 // Don't need to worry about B#/Cb here
    let noteRepr = noteName + noteRange

    let newPitch = document.createElement('option')

    newPitch.text = noteRepr
    newPitch.value = i
    lowestNoteSelect.add(newPitch)
    highestNoteSelect.add(newPitch.cloneNode(true))
  }
  lowestNoteSelect.value = app.config.lowestNote
  highestNoteSelect.value = app.config.highestNote
}

// Handle settings
var regenButton = document.getElementById('srt-regenerate')

regenButton.onclick = function () {
  app.config.clef = clefSelect.value
  app.config.key = keySelect.value
  app.config.accidentalFreq = parseFloat(accidentalField.value)
  app.config.highestNote = parseInt(highestNoteSelect.value)
  app.config.lowestNote = parseInt(lowestNoteSelect.value)

  highestNoteSelect.value = app.config.highestNote

  app.generateMusic()
  app.draw()
}

var noteDetectionApply = document.getElementById('srt-applydetection')
noteDetectionApply.onclick = function () {
  app.config.transposition = parseInt(noteTransposition.value)
}

app.generateMusic()
app.draw()

// Initially we want to start in midi mode
midiStart(app)

// CHEATS
// Cheating functions for testing rendering
function cheatNote (correct = true) {
  let currentNote = app.bars[app.currentBarIndex].notes[app.currentNoteIndex]
  var currentPitch = currentNote.pitch - app.config.transposition
  if (!correct) {
    currentPitch++
  }
  app.compareNote(currentPitch)
}

function cheatTrue () { cheatNote(true) }
function cheatFalse () { cheatNote(false) }

var correctButton = document.getElementById('correct-note')
var incorrectButton = document.getElementById('wrong-note')

correctButton.onclick = cheatTrue
incorrectButton.onclick = cheatFalse
