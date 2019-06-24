/**
 * Simple linear audio resampling function
 *
 * Taken from https://github.com/marl/crepe/blob/gh-pages/crepe.js
 */

// Original License follows
/*
The MIT License (MIT)

Copyright (c) 2018 Jong Wook Kim

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

const MODEL_SAMPLERATE = 16000
const BUFFER_SIZE = 1024

export default function resample (buffer) {
  const interpolate = (buffer.sampleRate % MODEL_SAMPLERATE !== 0)
  const multiplier = buffer.sampleRate / MODEL_SAMPLERATE
  const original = buffer.getChannelData(0)
  const subsamples = new Float32Array(BUFFER_SIZE)
  for (let i = 0; i < BUFFER_SIZE; i++) {
    if (!interpolate) {
      subsamples[i] = original[i * multiplier]
    } else {
      // simplistic, linear resampling
      let left = Math.floor(i * multiplier)
      let right = left + 1
      let p = i * multiplier - left
      subsamples[i] = (1 - p) * original[left] + p * original[right]
    }
  }
  return subsamples
}
