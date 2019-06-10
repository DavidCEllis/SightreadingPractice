import 'jsdom-global/register'

import { expect } from 'chai'
import { describe, it } from 'mocha'
import sinon from 'sinon'

import MainApp from '../src/main.js'

import jsdom from 'jsdom'
const { JSDOM } = jsdom


describe('MainApp', function () {
  const seed = 2
  let dom
  let document
  let testdiv
  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><div id="apptest"></div>')
    document = dom.window.document
    testdiv = document.getElementById('apptest')
  })
  describe('constructor', function () {
    it('Has default config settings', function () {
      let default_settings = {
        'keyName': 'C',
        'clef': 'treble',
        'highestNote': 81,
        'lowestNote': 57,
        'accidentalFreq': 0.1,
        'transposition': 0,
        'detectionMode': 'MIDI', // This is always midi for now
        'correctColor': 'blue',
        'incorrectColor': 'tomato',
        'audioNoiseFloor': 0.005,
        'audioMinAmplitude': 0.01,
        'minConfidence': 0.75
      }
      let app = new MainApp(testdiv, seed)
      expect(app.config.settings).to.eql(default_settings)
    })
    it('Applies provided config settings', function () {

      // Settings that are different to the default
      let demo_settings = {
        'keyName': 'G',
        'clef': 'bass',
        'highestNote': 88,
        'lowestNote': 44,
        'accidentalFreq': 0.5,
        'transposition': 12,
        'detectionMode': 'MIDI', // This is always midi for now
        'correctColor': 'green',
        'incorrectColor': 'red',
        'audioNoiseFloor': 0.01,
        'audioMinAmplitude': 0.1,
        'minConfidence': 0.60
      }
      let app = new MainApp(testdiv, seed, demo_settings)
      expect(app.config.settings).to.eql(demo_settings)
    })
    it ('Creates a MusicGenerator with config provided', function () {
      // Settings that are different to the default
      let demo_settings = {
        'keyName': 'G',
        'clef': 'bass',
        'highestNote': 88,
        'lowestNote': 44,
        'accidentalFreq': 0.5,
        'transposition': 12,
        'detectionMode': 'MIDI', // This is always midi for now
        'correctColor': 'green',
        'incorrectColor': 'red',
        'audioNoiseFloor': 0.01,
        'audioMinAmplitude': 0.1,
        'minConfidence': 0.60
      }
      let app = new MainApp(testdiv, seed, demo_settings)
      expect(app.generator.constructor.name).to.equal('MusicGenerator')
      expect(app.generator.config.settings).to.eql(demo_settings)
    })
  })
  describe('generateMusic', function () {
    let app
    beforeEach(() => {
      app = new MainApp(testdiv, seed)
    })
    it('Calls musicgen from a MusicGenerator object', function () {
      let app = new MainApp(testdiv, seed)
      let fakeMusicGen = sinon.spy(app.generator, 'musicGen')

      app.currentBarIndex = 12
      app.currentNoteIndex = 42
      app.generateMusic()

      expect(fakeMusicGen.called).to.be.true
      expect(app.currentBarIndex).to.equal(0)
      expect(app.currentNoteIndex).to.equal(0)
    })
  })
  describe('compareNote', function () {
    let app
    beforeEach(() => {
      app = new MainApp(testdiv, seed)
      app.generateMusic()
    })
    it('Calls playNote against the first note with the given input', function () {
      let testVal = 64
      let note = app.bars[0].notes[0] // first note
      let compareSpy = sinon.spy(note, 'playNote')
      sinon.stub(app, 'draw') // Prevent the slow method from being called
      app.compareNote(testVal)

      expect(compareSpy.calledWith(testVal)).to.be.true
    })
    it('Attempts to redraw the canvas once and only once after a note is played', function () {
      let drawStub = sinon.stub(app, 'draw')
      app.compareNote(66)
      expect(drawStub.calledOnce).to.be.true
    })
  })
})
