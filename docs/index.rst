.. Sight Reading Practice documentation master file, created by
   sphinx-quickstart on Wed Aug 28 16:46:14 2019.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to Sight Reading Practice's documentation!
==================================================

.. toctree::
   :maxdepth: 2
   :caption: Contents:

   note_detection/audio_input

This is a sight reading practice tool that generates random sheet music and
detects inputs to advance the position in the score.

The project is made up of 3 main components.

1. A music generator which handles creation of bars and notes and has the code for the PRNG

  - Using VexFlow to display the music created.

2. Note detection modes

  - MIDI input using webmidi.js

  - Audio input using CREPE with Tensorflow

3. User interface code that handles where things should be displayed and config options


Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
