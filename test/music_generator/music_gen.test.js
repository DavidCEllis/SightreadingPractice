import 'jsdom-global/register'  // Not testing vexflow functions but need a window so it doesn't fail

import { expect } from 'chai'
import { describe } from 'mocha'

import { AppConfig } from '../../src/config'
import { MusicGenerator } from '../../src/music_generator/music_gen'

// I'd like to test seeding with more random options - will have to look at jsverify
describe('MusicGenerator', function () {
  describe('musicGen()', function () {
    it('Should generate only notes in a key if p(accidental) = 0', function () {
      let config = new AppConfig({'accidentalFreq': 0, 'keyName': 'C'})
      let mg = new MusicGenerator(1, config)
      let bars = mg.musicGen()

      for (let bar of bars) {
        for (let note of bar.notes) {
          expect(config.key.notes).to.include(note.noteName)
        }
      }
    })
    it ('Should generate only accidentals if p(accidental) = 1', function () {
      let config = new AppConfig({'accidentalFreq': 1, 'keyName': 'C'})
      let mg = new MusicGenerator(1, config)
      let bars = mg.musicGen()

      for (let bar of bars) {
        for (let note of bar.notes) {
          expect(config.key.accidentals).to.include(note.noteName)
        }
      }
    })
  })
})
