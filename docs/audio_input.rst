==============================
Audio Input Listener Structure
==============================

The audio input listener is broken into multiple componenents in order
to make it easy to replace parts of it and update.

**audiolistener.js** contains the central component class that handles
interaction with the application. It converts all of the input data
and updates the score with new input values.

**amplitudemeter.js** contains a class that handles measuring amplitude,
this is used in the application to decide if a sound is loud enough to
be considered a new note.

**freqtomidi.js** contains a simple function that takes an input frequency
and returns the closest midi note number

**getstream.js** handles the various changes to the audio spec and creates
an audio context and media stream source.

**ml_pitchdetext.js** contains the tensorflow pitch detection model code
from *crepe*

**statsdisplay.js** contains the code that handles rendering the div
to display audio statistics.
