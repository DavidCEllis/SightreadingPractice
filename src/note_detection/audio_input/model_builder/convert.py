# Modified from original source
# https://github.com/marl/crepe/blob/555e4ce0b3fd757855e5c4a21283f725a74a12af/convert.py
# See LICENCE_EXT

import sys
import tensorflowjs as tfjs
from keras.layers import *
from keras.models import Model

import tensorflow as tf

# TF updated since the original source was created
tf.compat.v1.disable_eager_execution()
capacities = {'tiny': 4, 'small': 8, 'medium': 16, 'large': 24, 'full': 32}

model_size = sys.argv[1].split('.')[0].split('-')[1]


def crepe(optimizer, model_capacity=32):
    layers = [1, 2, 3, 4, 5, 6]
    filters = [n * model_capacity for n in [32, 4, 4, 4, 8, 16]]
    widths = [512, 64, 64, 64, 64, 64]
    strides = [(4, 1), (1, 1), (1, 1), (1, 1), (1, 1), (1, 1)]

    x = Input(shape=(1024,), name='crepe_input', dtype='float32')
    y = Reshape(target_shape=(1024, 1, 1), name='crepe_input_reshape')(x)

    for layer, filters, width, strides in zip(layers, filters, widths, strides):
        y = Conv2D(
            filters,
            (width, 1),
            strides=strides,
            padding='same',
            activation='relu',
            name=f"crepe_conv{layer}"
        )(y)
        y = BatchNormalization(name=f"crepe_conv{layer}_BN")(y)
        y = MaxPooling2D(pool_size=(2, 1), strides=None, padding='valid',
                         name=f"crepe_conv{layer}_maxpool")(y)
        y = Dropout(0.25, name=f"crepe_conv{layer}_dropout")(y)

    y = Flatten(name="crepe_flatten")(y)
    y = Dense(360, activation='sigmoid', name="crepe_classifier")(y)

    crepe_model = Model(inputs=x, outputs=y)

    print("Loading model weights")
    crepe_model.load_weights(sys.argv[1])

    crepe_model.compile(optimizer, 'binary_crossentropy')

    return crepe_model


print("Constructing a new model for tfjs ...")

capacity = capacities[model_size]
model = crepe('adam', capacity)

print("Saving tfjs model ...")
tfjs.converters.save_keras_model(model, f'model_{model_size}')

print("Done.")

