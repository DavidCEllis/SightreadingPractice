import 'jsdom-global/register'

import { expect } from 'chai'
import { describe, it, beforeEach } from 'mocha'
import sinon from 'sinon'

import MainApp from '../src/main'

import jsdom from 'jsdom'
const { JSDOM } = jsdom


describe('MainApp', function () {
  const seed = 2
  let dom
  let document
  let testdiv
  beforeEach(() => {
    let fakeHtml = `<!DOCTYPE html>
      <div id="apptest">
        <div class="row" id="srt-render"></div>
        <div class="alert alert-success" id="srt-status" hidden></div>
      </div>
    `
    dom = new JSDOM(fakeHtml)
    document = dom.window.document
    testdiv = document.getElementById('apptest')

    // Sinon magic to pretend our DIV has width
    sinon.stub(testdiv, 'clientWidth').get(function () { return 1250 })
  })
  describe('constructor()', function () {
    it('Has default config settings', function () {
      let default_settings = {
        'keyName': 'C',
        'clef': 'treble',
        'highestNote': 81,
        'lowestNote': 57,
        'accidentalFreq': 0.1,
        'transposition': 0,
        'detectionMode': 'MIDI', // This is always midi for now
        'correctColor': '#0000FF',
        'incorrectColor': '#FF6347',
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
  describe('generateMusic()', function () {
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
  describe('compareNote()', function () {
    let app
    beforeEach(() => {
      app = new MainApp(testdiv, seed)
      app.generateMusic()
      app.draw()
    })
    it('Calls playNote against the first note with the given input', function () {
      let testVal = 64
      let note = app.bars[0].notes[0] // first note
      let compareSpy = sinon.spy(note, 'playNote')
      sinon.stub(app, 'draw') // Prevent the slow method from being called
      app.compareNote(testVal)

      expect(compareSpy.calledWith(testVal)).to.be.true
    })
    it('Should modify the colour of a note directly (correct note)', function () {
      let note = app.bars[0].notes[0]
      let correctColor = app.config.correctColor

      app.compareNote(note.pitch)

      let notePaths = app.svgTag.getElementById(note.divID).getElementsByTagName('path')

      expect(notePaths[0].getAttribute('stroke')).to.equal(correctColor)
      expect(notePaths[1].getAttribute('fill')).to.equal(correctColor)
    })
    it('Should modify the colour of a note directly (incorrect note)', function () {
      let note = app.bars[0].notes[0]
      let incorrectColor = app.config.incorrectColor

      app.compareNote(note.pitch + 1)

      let notePaths = app.svgTag.getElementById(note.divID).getElementsByTagName('path')

      expect(notePaths[0].getAttribute('stroke')).to.equal(incorrectColor)
      expect(notePaths[1].getAttribute('fill')).to.equal(incorrectColor)
    })
    it('Should redraw the entire element only after all notes have been played', function () {
      let drawStub = sinon.stub(app, 'draw')
      let barCount = app.config.barCount

      while (app.currentBarIndex < barCount) {
        app.compareNote(42)
        expect(drawStub.called).to.be.false
      }
      app.compareNote(42)
      expect(drawStub.called).to.be.true
    })
  })
})
