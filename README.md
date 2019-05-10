# Sight reading practice tool #

A small site that generates random sheet music and reads midi input (key on) messages to determine if the notes have been played correctly. Try here <https://dcellismusic.com/sightreading>.

Makes use of the web midi API (via [WebMidi.js](https://github.com/djipco/webmidi)) to detect note inputs and [VexFlow](http://www.vexflow.com/) to handle the display.

Early testing of using [p5.js](http://p5js.org/) and [ml5](https://ml5js.org/) with the [Crepe pitch tracker](https://github.com/marl/crepe) for pitch detection and audio comparison.
