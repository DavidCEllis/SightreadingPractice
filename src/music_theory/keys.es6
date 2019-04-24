class MusicKey {
  constructor (name, notes, accidentals) {
    this.name = name
    this.notes = notes
    this.accidentals = accidentals
  }
  inKey (note) {
    return this.notes.includes(note)
  }
  inAccidentals (note) {
    return this.accidentals.includes(note)
  }
}

// Default Major Keys
// b9 note in accidentals will be treated as a double flat rather than a sharpened tonic
// EG in Db the accidental will be Ebb instead of D
const keyList = {
  'C': new MusicKey(
    'C',
    ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    ['Db', 'D#', 'Eb', 'F#', 'Gb', 'G#', 'Ab', 'A#', 'Bb']
  ),
  'C#': new MusicKey(
    'C#',
    ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#'],
    ['D', 'E', 'G', 'A', 'B']
  ),
  'Db': new MusicKey(
    'Db',
    ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
    ['Ebb', 'E', 'G', 'A', 'B']
  ),
  'D': new MusicKey(
    'D',
    ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
    ['Eb', 'F', 'G', 'A#', 'C']
  ),
  'Eb': new MusicKey(
    'Eb',
    ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
    ['Fb', 'Gb', 'A', 'B', 'Db']
  ),
  'E': new MusicKey(
    'E',
    ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
    ['F', 'G', 'A#', 'C', 'D']
  ),
  'F': new MusicKey(
    'F',
    ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
    ['Gb', 'Ab', 'B', 'Db', 'Eb']
  ),
  'F#': new MusicKey(
    'F#',
    ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'],
    ['G', 'A', 'C', 'D', 'E']
  ),
  'Gb': new MusicKey(
    'Gb',
    ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F'],
    ['A', 'B', 'C', 'D', 'E']
  ),
  'G': new MusicKey(
    'G',
    ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
    ['Ab', 'A#', 'C#', 'D#', 'F']
  ),
  'Ab': new MusicKey(
    'Ab',
    ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
    ['Bbb', 'B', 'D', 'E', 'Gb']
  ),
  'A': new MusicKey(
    'A',
    ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
    ['Bb', 'C', 'D#', 'F', 'G']
  ),
  'Bb': new MusicKey(
    'Bb',
    ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
    ['Cb', 'Db', 'E', 'Gb', 'Ab']
  ),
  'B': new MusicKey(
    'B',
    ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
    ['C', 'D', 'F', 'G', 'A']
  )
}

// Add Minor keys - based on relative majors
keyList['Cm'] = new MusicKey('Cm', keyList['Eb'].notes, keyList['Eb'].accidentals)
keyList['C#m'] = new MusicKey('C#m', keyList['E'].notes, keyList['E'].accidentals)
keyList['Dm'] = new MusicKey('Dm', keyList['F'].notes, keyList['F'].accidentals)
keyList['D#m'] = new MusicKey('D#m', keyList['F#'].notes, keyList['F#'].accidentals)
keyList['Ebm'] = new MusicKey('Ebm', keyList['Gb'].notes, keyList['Gb'].accidentals)
keyList['Em'] = new MusicKey('Em', keyList['G'].notes, keyList['G'].accidentals)
keyList['Fm'] = new MusicKey('Fm', keyList['Ab'].notes, keyList['Ab'].accidentals)
keyList['F#m'] = new MusicKey('F#m', keyList['A'].notes, keyList['A'].accidentals)
keyList['Gm'] = new MusicKey('Gm', keyList['Bb'].notes, keyList['Bb'].accidentals)
keyList['G#m'] = new MusicKey('G#m', keyList['B'].notes, keyList['B'].accidentals)
keyList['Am'] = new MusicKey('Am', keyList['C'].notes, ['C#', 'Db', 'D#', 'Eb', 'F#', 'Gb', 'G#', 'Bb'])
keyList['A#m'] = new MusicKey('A#m', keyList['C#'].notes, keyList['C#'].accidentals)
keyList['Bbm'] = new MusicKey('Bbm', keyList['Db'].notes, keyList['Db'].accidentals)
keyList['Bm'] = new MusicKey('Bm', keyList['D'].notes, keyList['D'].accidentals)

export default keyList
