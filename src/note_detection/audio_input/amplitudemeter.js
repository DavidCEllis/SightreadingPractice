/**
 * Simple average RMS calculation for a set of samples
 *
 * @param input
 * @returns {number}
 */

function getAmplitude (input) {
  let sum = 0.0
  for (let i = 0; i < input.length; i++) {
    sum += input[i] ** 2
  }
  return (sum / input.length) ** 0.5
}

export default getAmplitude
