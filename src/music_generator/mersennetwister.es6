/*
  Mersenne twister algorithm implemented in ES6 JavaScript

  Code here is longer for additional clarity
  Should match values from https://github.com/boo1ean/mersenne-twister
  No array generator - out of scope for what I needed
*/

import { InitializationError, ValueError } from '../errors.es6'

/* MT Constants - preceeded with mt */
const mtW = 32 // This MT uses 32 bit word length
const mtN = 624 // degree of recurrence (# elements in array)
const mtM = 397 // Middle offset
const mtR = 31 // Separation point of a word
const mtA = 0x9908b0df // twist matrix coefficients

const mtLowerMask = ((1 << mtR) >>> 0) - 1 // >>> 0 because javascript returns signed integers for bitshifts ¯\_(ツ)_/¯
const mtUpperMask = (0xffffffff ^ mtLowerMask) >>> 0

/* MT Tempering masks and shifts (shift that would be d is a noop) */
const mtB = 0x9d2c5680 // Tempering bitmask
const mtC = 0xefc60000 // Tempering bitmask
const mtS = 7 // Tempering bitshift
const mtT = 15 // Tempering bitshift
const mtU = 11 // Tempering bitshift
const mtL = 18 // Tempering bitshift

const mtF = 1812433253 // Seeding multiplicative factor

class MersenneTwister {
  /**
   * Mersenne twister implemented in ES6
   * @param seed integer seed value for the PRNG (required).
   */

  constructor (seed) {
    // Some error checking
    if (seed === undefined) {
      throw new ValueError('User must provide a seed value.')
    } else if (typeof seed !== 'number') {
      throw new ValueError('Seed value must be a number.')
    } else if (!Number.isInteger(seed)) {
      throw new ValueError('Seed value must be an integer.')
    }
    // State
    this.arr = [] // MT array
    this.index = mtN + 1 // Initially set the index beyond the end of the array for a test
    this.seedMT(seed) // Seed the RNG
  }

  seedMT (seed) {
    /**
     * Seed the PRNG
     * @param seed - PRNG Integer initial seed value (required)
     */
    // Clean seed value to 32 bit unsigned range
    seed >>>= 0

    this.index = mtN // Set to length of array to trigger twist on first attempt to retrieve int
    this.arr = [] // clean new array
    this.arr.push(seed)
    for (let i = 1; i < mtN; i++) {
      let prevVal = this.arr[i - 1]
      let nextVal = prevVal ^ (prevVal >>> (mtW - 2))

      // Split high and low masks to avoid precision loss
      let nextHigh = (((nextVal & 0xffff0000) >>> 16) * mtF) << 16
      let nextLow = (nextVal & 0x0000ffff) * mtF

      nextVal = (nextHigh + nextLow) + i

      // force to 32 bit int
      nextVal >>>= 0
      this.arr.push(nextVal)
    }
  }

  twist () {
    /* Code to refresh the array */
    for (let i = 0; i < mtN; i++) {
      let x = (this.arr[i] & mtUpperMask) | (this.arr[(i + 1) % mtN] & mtLowerMask)
      let xA = x >>> 1
      if (x % 2 !== 0) {
        xA ^= mtA
      }
      this.arr[i] = (this.arr[(i + mtM) % mtN] ^ xA)
    }
    this.index = 0
  }

  randomInt () {
    /**
     * Return next integer value from PRNG
     */

    // Checks for value
    /* istanbul ignore if */
    if (this.index > mtN) {
      throw new InitializationError('Twister has not been initialized with a seed value (how!?).')
    } else if (this.index === mtN) {
      this.twist()
    }
    let output = this.arr[this.index]
    // Temper value
    output ^= (output >>> mtU)
    output ^= ((output << mtS) & mtB)
    output ^= ((output << mtT) & mtC)
    output ^= (output >>> mtL)
    output >>>= 0

    this.index += 1
    return output
  }

  randomReal () {
    /**
     * Return a value in [0, 1)
     * @returns random float between 0 and 1 (does not include 1)
     */
    return this.randomInt() * (1.0 / (2.0 ** 32))
  }

  randomBetween (low, high) {
    /**
     * Produce a random integer value between low and high
     *
     * Excluding the high value.
     * @param low - lowest integer value in random range.
     * @param high - highest integer value in random range.
     * @returns random integer between low and high
     */
    let result
    if (low === high) {
      throw new ValueError(
        'Highest value is not strictly higher than lowest: (low: ' + low + ', high: ' + high + ')'
      )
    } else {
      result = Math.floor((this.randomReal() * (high - low)) + low)
    }
    return result
  }

  randomFrom (options) {
    /**
     * Select a random item from an array
     * @param {Array} options - A list of options for random selection.
     * @returns random object from options.
     */
    if (options.length === 0) {
      throw new ValueError('Array provided must have at least one item.')
    }
    let resultIndex = this.randomBetween(0, options.length)
    return options[resultIndex]
  }
}

export { MersenneTwister }
