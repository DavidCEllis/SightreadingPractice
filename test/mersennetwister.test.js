import { expect } from 'chai'
import { describe } from 'mocha'

import { MersenneTwister } from '../src/music_generator/mersennetwister.es6'

describe('MersenneTwister', function () {

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
})