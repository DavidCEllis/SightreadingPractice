/*
This should deal with all the form elements and setting up and anything related to the DOM
No music generation or recognition logic should appear here.
*/

import MainApp from './main.es6'
import { MIDIListener } from './note_detection/midi_input.es6'
import { AUDIOListener } from './note_detection/audio_input.es6'
import { keyList } from './music_theory/keys.es6'

import './styles/style.css'

// Get the element ID for the div to render the score
const div = document.getElementById('srt-render')

let seed = Date.now() // Use timestamp as basic RNG seed
const app = new MainApp(div, seed)

const midiListener = new MIDIListener()
const audioListener = new AUDIOListener()

// Generation settings IDs
const clefSelect = document.getElementById('srt-clef')
const keySelect = document.getElementById('srt-key-list')
const accidentalField = document.getElementById('srt-accidentals')
const lowestNoteSelect = document.getElementById('srt-lowestnote')
const highestNoteSelect = document.getElementById('srt-highestnote')

// Detection Settings IDs
const detectMidi = document.getElementById('srt-input-midi')
const detectAudio = document.getElementById('srt-input-audio')
const noteTransposition = document.getElementById('srt-transposition')
const noiseFloor = document.getElementById('srt-noisefloor')
const minAmplitude = document.getElementById('srt-minamplitude')
const confidenceLevel = document.getElementById('srt-confidencelevel')

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

// Set default values from config
noteTransposition.value = app.config.transposition
noiseFloor.value = app.config.audioNoiseFloor * 10000
minAmplitude.value = app.config.audioMinAmplitude * 10000
confidenceLevel.value = app.config.minConfidence * 100

// Add complete note range to min/max pitches
{
  let key = keyList['C']
  for (let i = 127; i >= 0; i--) {
    let noteName = key.getRepresentation(i).name
    let noteRange = Math.floor(i / 12) - 1 // Don't need to worry about B#/Cb here
    let noteRepr = noteName + noteRange

    let newPitch = document.createElement('option')

    newPitch.text = noteRepr
    newPitch.value = i.toString()
    lowestNoteSelect.add(newPitch)
    highestNoteSelect.add(newPitch.cloneNode(true))
  }
  lowestNoteSelect.value = app.config.lowestNote
  highestNoteSelect.value = app.config.highestNote
}

// Handle music generation settings
const regenButton = document.getElementById('srt-regenerate')

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

// Handle note detection settings
const noteDetectionApply = document.getElementById('srt-applydetection')

noteDetectionApply.onclick = function () {
  let useMidi = detectMidi.checked
  let useAudio = detectAudio.checked
  if (useMidi) {
    if (audioListener.isActive) {
      audioListener.disable()
    }
    if (!midiListener.isActive) {
      midiListener.enable(app)
    }
  } else if (useAudio) {
    if (midiListener.isActive) {
      midiListener.disable()
    }
    if (!audioListener.isActive) {
      audioListener.enable(app)
    }
  }
  app.config.transposition = parseInt(noteTransposition.value)
  app.config.audioNoiseFloor = parseInt(noiseFloor.value) / 10000
  app.config.audioMinAmplitude = parseInt(minAmplitude.value) / 10000
  app.config.minConfidence = parseInt(confidenceLevel.value) / 100
}

app.generateMusic()
app.draw()

// Initially we want to start in midi mode
midiListener.enable(app)

// CHEATS
// Cheating functions for testing rendering
function cheatNote (correct = true) {
  let currentNote = app.bars[app.currentBarIndex].notes[app.currentNoteIndex]
  let currentPitch = currentNote.pitch - app.config.transposition
  if (!correct) {
    currentPitch++
  }
  app.compareNote(currentPitch)
}

function cheatTrue () { cheatNote(true) }
function cheatFalse () { cheatNote(false) }

const correctButton = document.getElementById('correct-note')
const incorrectButton = document.getElementById('wrong-note')

correctButton.onclick = cheatTrue
incorrectButton.onclick = cheatFalse
