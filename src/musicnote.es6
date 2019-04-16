/*
  Class to define a musical note

  Used to convert from our internal representation to one required by vexflow
  Done to keep vexflow code out of the music generation
*/

class MusicNote {
  constructor (pitch, duration) {
    this.pitch = pitch
    this.duration = duration
  }
}

export { MusicNote }
