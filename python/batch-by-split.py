import json

import numpy as np
import pandas as pd

def get_json_data(filename):
    with open(filename) as data_file:
        return json.load(data_file)

class Batch():
    def __init__(self, data, batch_size=None):
        self.data = np.array(data)
        self.batch_size = batch_size
        self.shuffle().split().batch()
        # print(self.batches)

    def shuffle(self):
        np.random.shuffle(self.data)
        return self

    def split(self, train_percent=.6, validate_percent=.2, seed=None):
        m = len(self.data)
        train_end = int(train_percent * m)
        validate_end = int(validate_percent * m) + train_end
        split = np.split(self.data, [train_end, validate_end, m])
        self.train, self.validate, self.test = split[0], split[1], split[2],
        # print(self.train.shape)
        # print(self.validate.shape)
        # print(self.test.shape)
        return self

    def batch(self):
        self.batches = np.array([])
        length = len(self.train)
        rest = length % self.batch_size
        if(rest != 0):
            mark = int(length-rest)
            left = np.split(self.train[:mark], self.batch_size)
            right = np.array(self.train[mark:])
            self.batches = left
            for i in range(len(right)):
                self.batches[i] = np.append(left[i], [right[i]], axis=0)
        else:
            self.batches = np.split(self.train, self.batch_size)
        return self

data = get_json_data('pareto.json')
batch = Batch(data, 11)
