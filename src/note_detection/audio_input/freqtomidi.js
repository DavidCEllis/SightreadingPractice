/**
 * Convert an input frequency to a valid pitch based on 12TET A440
 * return -1 for an invalid/no pitch
 *
 * @param freq
 * @param detune - number of cents away from actual pitch accepted
 */
function freqToMidi (freq, detune = 20) {
  let midiFloat = (12 / Math.log(2)) * Math.log(freq / 440) + 69
  let midiPitch = Math.round(midiFloat)
  let diff = (midiFloat - midiPitch) * 100 // Difference from midi pitch in 12TET A440 in cents
  if (Math.abs(diff) > detune || midiFloat < 0 || midiFloat > 127) {
    return -1
  } else {
    return midiPitch
  }
}

export default freqToMidi
