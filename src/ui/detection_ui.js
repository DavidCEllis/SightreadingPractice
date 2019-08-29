import { MIDIListener } from '../note_detection/midi_input'
import { AudioListener } from '../note_detection/audio_input/audiolistener'
import { audioSettings } from './config_ui'
import { errorDialog } from './error_ui'

// Get the two listeners
const midiListener = new MIDIListener()
const audioListener = new AudioListener()

// Place for audio statistics
const audioStats = document.getElementById('srt-audiostats')

const activateButton = document.getElementById('srt-activate')
let detectionEnabled = false

// Functions to enable and disable audio or midi pitch detection
function enableDetection (app) {
  // Remove the element telling you to activate the detection
  document.getElementById('srt-activate-text').style.display = 'none'

  if (app.config.detectionMode === 'MIDI') {
    if (audioListener.isActive) {
      audioListener.disable().catch((e) => { errorDialog(e.message) })
    }
    if (!midiListener.isActive) {
      try {
        midiListener.enable(app).catch((e) => { errorDialog(e.message) })
      } catch (e) {
        errorDialog(e.message)
        return // Don't enable detection
      }
    }
  } else if (app.config.detectionMode === 'AUDIO') {
    if (midiListener.isActive) {
      midiListener.disable().catch((e) => { errorDialog(e.message) })
    }
    if (!audioListener.isActive) {
      audioListener.enable(app, audioStats).catch((e) => {
        errorDialog(e.message)
      })
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
    midiListener.disable().catch((e) => { errorDialog(e.message) })
  } else if (audioListener.isActive) {
    audioListener.disable().catch((e) => { errorDialog(e.message) })
  }

  // Update button
  activateButton.innerText = 'Activate'
  activateButton.classList.remove('btn-success')
  activateButton.classList.add('btn-outline-success')

  // Store state
  detectionEnabled = false
}

function toggleDetection (app) {
  if (detectionEnabled) {
    disableDetection()
  } else {
    enableDetection(app)
  }
}

const audioButton = document.getElementById('srt-audio-select')
const midiButton = document.getElementById('srt-midi-select')

// Handle audio and midi buttons
// Update buttons for midi or audio
function updateButtonDisplay (app) {
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
  if (detectionEnabled) { enableDetection(app) }
}

let visibilityDisable = false

function handleVisibilityChange (app) {
  if (document.hidden && detectionEnabled) {
    disableDetection()
    visibilityDisable = true
  } else if (visibilityDisable) {
    enableDetection(app)
    visibilityDisable = false
  }
}

function detectionInit (app) {
  activateButton.onclick = function () { toggleDetection(app) }
  audioButton.onclick = function () {
    app.config.detectionMode = 'AUDIO'
    audioSettings.forEach((element) => {
      element.disabled = false
    })
    updateButtonDisplay(app)
  }

  midiButton.onclick = function () {
    app.config.detectionMode = 'MIDI'
    audioSettings.forEach((element) => {
      element.disabled = true
    })
    updateButtonDisplay(app)
  }

  // On visibility change the input should be disabled/reenabled
  document.addEventListener(
    'visibilitychange',
    function () { handleVisibilityChange(app) }
  )
}

export { detectionInit }
