import MainApp from './main.es6'

// Create an SVG renderer and attach it to the DIV element named "boo".
var div = document.getElementById('vexflow')

var app = new MainApp(div)

app.generateNotes()
app.draw()

// Cheating functions for testing rendering

function cheatNote (correct = true) {
  let currentNote = app.notes[app.currentIndex]
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
