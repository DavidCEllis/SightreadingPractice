import { expect } from 'chai'
import { describe } from 'mocha'

import { MersenneTwister } from '../../src/music_generator/mersennetwister.es6'
import { InitializationError, ValueError } from '../../src/errors.es6'

const mtN = 624 // degree of recurrence (# elements in array)

describe('MersenneTwister', function () {
  describe('constructor', function () {
    it('Should throw a ValueError if not given a value', function () {
      expect(() => { new MersenneTwister() }).to.throw(ValueError, 'User must provide a seed value.')
    })
    it('Should throw a ValueError if the input is not a number', function () {
      expect(() => { new MersenneTwister('pie')}).to.throw(ValueError, 'Seed value must be a number.')
    })
    it('Should throw a ValueError if the input is not an integer', function() {
      expect(() => { new MersenneTwister(3.14)}).to.throw(ValueError, 'Seed value must be an integer.')
    })
  })
  describe('randomInt()', function () {
    it('Should generate the same "random" numbers with the same seed', function () {
      let prng = new MersenneTwister(42)
      let expected = [
        1608637542,
        3421126067,
        4083286876,
        787846414,
        3143890026,
        3348747335,
        2571218620,
        2563451924,
        670094950,
        1914837113
      ]
      for (let i = 0; i < expected.length; i++) {
        expect(prng.randomInt()).to.equal(expected[i])
      }
    })
  })
  describe('randomBetween()', function () {
    it('Should throw an error if high <= low', function () {
      let prng = new MersenneTwister(42)
      expect(() => { prng.randomBetween(10, 10) }).to.throw()
    })
    it('Should return all values between low and high exclusive', function () {
      let prng = new MersenneTwister(42)
      let low_val = -2
      let high_val = 3
      let expected_set = new Set([-2, -1, 0, 1, 2])
      let returned_set = new Set()

      for (let i = 0; i < 100; i++) {
        returned_set.add(prng.randomBetween(low_val, high_val))
      }
      expect(returned_set).to.eql(expected_set)
    })
  })
  describe('randomInt()', function () {
    it('Should throw an InitializationError if it is somehow not initialized', function () {
      let prng = new MersenneTwister(42)
      prng.index = mtN + 1 // change the index so it appears uninitialized
      expect(() => { prng.randomInt() }).to.throw(InitializationError)
    })
    it('Should construct the same sequence with the same seed.', function () {
      let prng = new MersenneTwister(42)
      let expected = [
        0.37454011430963874,
        0.7965429842006415,
        0.9507143115624785,
        0.18343478767201304,
        0.7319939383305609
      ]
      let results = []
      for (let i = 0; i < 5; i++) {
        results.push(prng.randomReal())
      }
      expect(results).to.eql(expected)
    })
  })
  describe('randomFrom()', function () {
    it('Should throw a ValueError on an empty array', function () {
      let prng = new MersenneTwister(42)
      let empty = []
      expect(() => { prng.randomFrom(empty) }).to.throw(ValueError, 'Array provided must have at least one item.')
    })
  })
})