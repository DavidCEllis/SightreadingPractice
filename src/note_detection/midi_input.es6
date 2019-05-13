import WebMidi from 'webmidi'

/**
 * Midi listener
 *
 * Class to setup and teardown midi listening for the app.
 * This handles the midi events and sends the notes as they are played to the app
 */
class MIDIListener {
  /**
   * Enable listening for inputs via MIDI
   *
   * @param app - sight reading practice application
   */
  enable (app) {
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
  /**
   * Disable listening for inputs via MIDI
   */
  disable () {
    // Clear listeners
    WebMidi.inputs.forEach(input => input.removeListener('noteon', 'all'))
    // Disable webmidi
    WebMidi.disable()
    console.log('WebMidi disabled')
  }
  get isActive () {
    return WebMidi.interface != null
  }
}

export { MIDIListener }