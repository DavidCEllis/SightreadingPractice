import MainApp from './main.es6'
import WebMidi from 'webmidi'

// Get the element ID for the div to render the score
var div = document.getElementById('srt-render')

var seed = Date.now() // Use timestamp as basic RNG seed
var app = new MainApp(div, seed)

var keySelect = document.getElementById('srt-key-list')
var keyOptions = app.config.keyNames.map(() => document.createElement('option'))

for (let i = 0; i < keyOptions.length; i++) {
  keyOptions[i].text = app.config.keyNames[i]
  keySelect.add(keyOptions[i])
}

// Handle settings
var accidentalField = document.getElementById('srt-accidentals')
var regenButton = document.getElementById('srt-regenerate')

regenButton.onclick = function () {
  app.config.key = keySelect.value
  app.config.accidentalFreq = accidentalField.value
  app.generateMusic()
  app.draw()
}

app.generateMusic()
app.draw()

WebMidi.enable(function (err) {
  if (err) {
    console.log('WebMidi could not be enabled.', err)
  } else {
    console.log('WebMidi enabled!')
    console.log('List of Inputs')
    WebMidi.inputs.forEach(input => console.log(input.name))
    console.log('Listening for events from all devices')
    WebMidi.inputs.forEach(input => input.addListener('noteon', 'all',
      function (e) {
        app.compareNote(e.note.number)
      }
    ))
  }
})

// CHEATS
// Cheating functions for testing rendering
function cheatNote (correct = true) {
  let currentNote = app.bars[app.currentBarIndex].notes[app.currentNoteIndex]
  var currentPitch = currentNote.pitch
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
