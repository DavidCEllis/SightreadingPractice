/* global localStorage */
/*
This should deal with all the form elements and setting up and anything related to the DOM
No music generation or recognition logic should appear here.
*/

import MainApp from './main'
import { configInit } from './ui/config_ui'
import { detectionInit } from './ui/detection_ui'

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

// Initialise all the ui components
configInit(app)
detectionInit(app)

// Handle music generation settings
const regenButton = document.getElementById('srt-regenerate')

regenButton.onclick = function () {
  app.generateMusic()
  app.draw()
}

// Draw the initial score
app.generateMusic()
app.draw()

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
