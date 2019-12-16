const PITCH_STANDARD = 440 // A440
const MIDI_A = 69 // Midi number of A4 (440Hz)
const OCTAVE = 12 // Notes in an octave

/**
 * Convert an input frequency to a valid pitch based on 12TET A440
 * return -1 for an invalid/no pitch
 *
 * @param {number} freq - input frequency
 * @param {number} detune - detect frequencies within +/-detune cents as the actual note
 *
 * @returns {number} midi note value nearest to input pitch
 */
function freqToMidi (freq, detune = 20) {
  let midiFloat = OCTAVE * Math.log2(freq / PITCH_STANDARD) + MIDI_A
  let midiPitch = Math.round(midiFloat)
  let diff = (midiFloat - midiPitch) * 100 // Difference from midi pitch in 12TET A440 in cents
  if (Math.abs(diff) > detune || midiFloat < 0 || midiFloat > 127) {
    return -1
  } else {
    return midiPitch
  }
}

export default freqToMidi
