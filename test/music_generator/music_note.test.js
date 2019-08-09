import { expect } from 'chai'
import { describe, it } from 'mocha'

import { AppConfig } from '../../src/config'
import { MusicNote } from '../../src/music_generator/music_note'

describe('MusicNote', function () {
  describe('constructor()', function () {
    it('Should store the inputs in the instance', function () {
      let config = new AppConfig({})
      let pitch = 60
      let duration = 'q'

      let note = new MusicNote(pitch, duration, config)

      expect(note.pitch).to.equal(pitch)
      expect(note.duration).to.equal(duration)
      expect(note.config).to.equal(config)
    })
    it('Should generate elements for VexFlow display', function () {
      let config = new AppConfig({ settings: { clef: 'treble' } })
      let pitch = 60
      let duration = 'q'

      let note = new MusicNote(pitch, duration, config)

      expect(note.vexElement.keys).to.eql(['C/4'])
      expect(note.vexElement.duration).to.equal(duration)
      expect(note.vexElement.clef).to.equal('treble')
      expect(note.divID).to.include('auto')
    })
  })
  describe('keyPitch', function () {
    it('Should return C4 for C4 in the key of C', function () {
      let config = new AppConfig({ settings: { keyName: 'C' } })
      let pitch = 60
      let duration = 'q'
      let note = new MusicNote(pitch, duration, config)

      expect(note.noteName).to.equal('C')
      expect(note.noteRange).to.equal(4)
      expect(note.keyPitch).to.equal('C/4')
    })
    it('Should return B#3 for C4 in the key of C#', function () {
      let config = new AppConfig({ settings: { keyName: 'C#' } })
      let pitch = 60
      let duration = 'q'

      let note = new MusicNote(pitch, duration, config)

      expect(note.noteName).to.equal('B#')
      expect(note.noteRange).to.equal(3)
      expect(note.keyPitch).to.equal('B#/3')
    })
    it('Should return Cb4 for B3 in the key of Bb', function () {
      let config = new AppConfig({ settings: { keyName: 'Bb' } })
      let pitch = 59
      let duration = 'q'

      let note = new MusicNote(pitch, duration, config)

      expect(note.noteName).to.equal('Cb')
      expect(note.noteRange).to.equal(4)
      expect(note.keyPitch).to.equal('Cb/4')
    })
  })
})
