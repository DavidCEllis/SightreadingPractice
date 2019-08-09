/* global localStorage */
/*
This should deal with all the form elements and setting up and anything related to the DOM
No music generation or recognition logic should appear here.
*/

import MainApp from './main'
import { MIDIListener } from './note_detection/midi_input'
import { AudioListener } from './note_detection/audio_input/audiolistener'
import { keyList } from './music_theory/keys'

import './scss/main.scss'
import 'bootstrap'

// Get the element ID for the div to render the score
const div = document.getElementById('srt-render')

const seed = Date.now() // Use timestamp as basic RNG seed

// Create settings
let settings = JSON.parse(localStorage.getItem('appConfig'))
if (settings === null) {
  settings = {}
}

// Create app for general use
const app = new MainApp(div, seed, settings)

// Get the two listeners
const midiListener = new MIDIListener()
const audioListener = new AudioListener()

// Place for audio statistics
const audioStats = document.getElementById('srt-audiostats')

// Generation settings IDs
const clefSelect = document.getElementById('srt-clef')
const keySelect = document.getElementById('srt-key-list')
const accidentalField = document.getElementById('srt-accidentals')
const lowestNoteSelect = document.getElementById('srt-lowestnote')
const highestNoteSelect = document.getElementById('srt-highestnote')

// Detection Settings IDs
const noteTransposition = document.getElementById('srt-transposition')

const audioSettings = document.getElementsByClassName('srt-audio-settings')
const noiseFloor = document.getElementById('srt-noisefloor')
const minAmplitude = document.getElementById('srt-minamplitude')
const confidenceLevel = document.getElementById('srt-confidencelevel')

// Show or hide audio settings based on mode
audioSettings.forEach((element) => {
  element.disabled = (app.config.detectionMode === 'MIDI')
})

noteTransposition.value = app.config.transposition

// Audio only settings
noiseFloor.value = app.config.audioNoiseFloor * 10000
minAmplitude.value = app.config.audioMinAmplitude * 10000
confidenceLevel.value = app.config.minConfidence * 100

// Music Generator Settings Box

// Add clef options to dropdown
{
  let clefOptions = ['treble', 'bass', 'alto', 'tenor']
  for (let clef of clefOptions) {
    let clefElement = document.createElement('option')
    clefElement.text = clef.charAt(0).toUpperCase() + clef.slice(1)
    clefElement.value = clef
    clefSelect.add(clefElement)
  }
  clefSelect.value = app.config.clef
}

// Add key options to dropdown
{
  let keyOptions = app.config.keyNames.map(() => document.createElement('option'))
  for (let i = 0; i < keyOptions.length; i++) {
    keyOptions[i].text = app.config.keyNames[i]
    keyOptions[i].value = app.config.keyNames[i]
    keySelect.add(keyOptions[i])
  }
  keySelect.value = app.config.keyName
}

accidentalField.value = app.config.accidentalFreq

// Handle note lists
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

const activateButton = document.getElementById('srt-activate')
let detectionEnabled = false

// Functions to enable and disable audio or midi pitch detection
function enableDetection () {
  let activateText = document.getElementById('srt-activate-text').style.display = 'none'
  if (app.config.detectionMode === 'MIDI') {
    if (audioListener.isActive) {
      audioListener.disable()
    }
    if (!midiListener.isActive) {
      midiListener.enable(app)
    }
  } else if (app.config.detectionMode === 'AUDIO') {
    if (midiListener.isActive) {
      midiListener.disable()
    }
    if (!audioListener.isActive) {
      audioListener.enable(app, audioStats)
    } else {
      audioListener.stats.reset()
    }
  }
  activateButton.innerText = 'Deactivate'
  activateButton.classList.remove('btn-outline-success')
  activateButton.classList.add('btn-success')
  detectionEnabled = true
}

function disableDetection () {
  // Turn off listener
  if (midiListener.isActive) {
    midiListener.disable()
  } else if (audioListener.isActive) {
    audioListener.disable()
  }

  // Update button
  activateButton.innerText = 'Activate'
  activateButton.classList.remove('btn-success')
  activateButton.classList.add('btn-outline-success')

  // Store state
  detectionEnabled = false
}

function toggleDetection () {
  if (detectionEnabled) {
    disableDetection()
  } else {
    enableDetection()
  }
}

activateButton.onclick = toggleDetection

// Handle music generation settings
const regenButton = document.getElementById('srt-regenerate')

regenButton.onclick = function () {
  app.generateMusic()
  app.draw()
}

// Handle note detection settings
const applyConfigButton = document.getElementById('srt-applyconfig')

applyConfigButton.onclick = function () {
  app.config.clef = clefSelect.value
  app.config.keyName = keySelect.value
  app.config.accidentalFreq = parseFloat(accidentalField.value)
  app.config.highestNote = parseInt(highestNoteSelect.value)
  app.config.lowestNote = parseInt(lowestNoteSelect.value)

  highestNoteSelect.value = app.config.highestNote

  app.config.transposition = parseInt(noteTransposition.value)
  app.config.audioNoiseFloor = parseInt(noiseFloor.value) / 10000
  app.config.audioMinAmplitude = parseInt(minAmplitude.value) / 10000
  app.config.minConfidence = parseInt(confidenceLevel.value) / 100

  // Store config
  localStorage.setItem('appConfig', JSON.stringify(app.config.settings))
}

const audioButton = document.getElementById('srt-audio-select')
const midiButton = document.getElementById('srt-midi-select')

// Handle audio and midi buttons
// Update buttons for midi or audio
function updateButtonDisplay () {
  if (app.config.detectionMode === 'MIDI') {
    audioButton.classList.remove('btn-primary')
    audioButton.classList.add('btn-outline-primary')
    midiButton.classList.remove('btn-outline-primary')
    midiButton.classList.add('btn-primary')
  } else {
    audioButton.classList.remove('btn-outline-primary')
    audioButton.classList.add('btn-primary')
    midiButton.classList.remove('btn-primary')
    midiButton.classList.add('btn-outline-primary')
  }
  if (detectionEnabled) { enableDetection() }
}

audioButton.onclick = function () {
  app.config.detectionMode = 'AUDIO'
  audioSettings.forEach((element) => {
    element.disabled = false
  })
  updateButtonDisplay()
}

midiButton.onclick = function () {
  app.config.detectionMode = 'MIDI'
  audioSettings.forEach((element) => {
    element.disabled = true
  })
  updateButtonDisplay()
}

app.generateMusic()
app.draw()

// Handle active/inactive window
/**
 * Disable the audio/midi input if the page is not visible (you're not looking at the music then!)
 * Re-enable when you tab back
 */
let visibilityDisable = false

function handleVisibilityChange () {
  if (document.hidden && detectionEnabled) {
    disableDetection()
    visibilityDisable = true
  } else if (visibilityDisable) {
    enableDetection()
    visibilityDisable = false
  }
}

document.addEventListener('visibilitychange', handleVisibilityChange)

// CHEATS
// Cheating functions for testing rendering
function cheatNote (correct = true) {
  if (app.currentBarIndex < app.bars.length) {
    let currentNote = app.bars[app.currentBarIndex].notes[app.currentNoteIndex]
    let currentPitch = currentNote.pitch - app.config.transposition
    if (!correct) {
      currentPitch++
    }
    app.compareNote(currentPitch)
  } else {
    app.generateMusic()
    app.draw()
  }
}

function cheatTrue () { cheatNote(true) }

function cheatFalse () { cheatNote(false) }

const correctButton = document.getElementById('correct-note')
const incorrectButton = document.getElementById('wrong-note')

correctButton.onclick = cheatTrue
incorrectButton.onclick = cheatFalse
