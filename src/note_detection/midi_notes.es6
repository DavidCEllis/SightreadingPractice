import WebMidi from 'webmidi'

function midiStart (app) {
  // Enable web midi
  WebMidi.enable(function (err) {
    if (err) {
      console.log('WebMidi could not be enabled.', err)
    } else {
      console.log('WebMidi enabled!')
      console.log('List of Inputs')
      WebMidi.inputs.forEach(input => console.log(input.name))

      // Listen for midi on messages from every midi device
      console.log('Listening for events from all devices')
      WebMidi.inputs.forEach(input => input.addListener('noteon', 'all',
        function (e) {
          // Compare the number of the midi note to the value of the next note in the app
          app.compareNote(e.note.number)
        }
      ))
    }
  })
}

function midiStop () {
  WebMidi.disable()
}

export { midiStart, midiStop }
