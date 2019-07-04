I wanted to use the CREPE pitch estimation model in JS but the code in the CREPE repository
for converting the models to the shards needed in tensorflow.js no longer works.

Modified from the original source in the CREPE repository to work with updated tensorflow/keras.

Requires models from: https://github.com/marl/crepe/tree/models

Install requirements in a clean python 3.6/3.7 environment
`pip install -r requirements.txt`

Usage example: `python convert.py model-tiny.h5`
