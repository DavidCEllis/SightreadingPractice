// Generation settings IDs
import { keyList } from '../music_theory/keys'

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

function setupClefs (app) {
  let clefOptions = ['treble', 'bass', 'alto', 'tenor']
  for (let clef of clefOptions) {
    let clefElement = document.createElement('option')
    clefElement.text = clef.charAt(0).toUpperCase() + clef.slice(1)
    clefElement.value = clef
    clefSelect.add(clefElement)
  }
  clefSelect.value = app.config.clef
}

function setupKeys (app) {
  let keyOptions = app.config.keyNames.map(() => document.createElement('option'))
  for (let i = 0; i < keyOptions.length; i++) {
    keyOptions[i].text = app.config.keyNames[i]
    keyOptions[i].value = app.config.keyNames[i]
    keySelect.add(keyOptions[i])
  }
  keySelect.value = app.config.keyName
}

function setupNotes (app) {
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

function enableButton (app) {
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
}

function configInit (app) {
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
  setupClefs(app)
  setupKeys(app)
  setupNotes(app)
  accidentalField.value = app.config.accidentalFreq
  enableButton(app)
}

export { audioSettings, configInit }
