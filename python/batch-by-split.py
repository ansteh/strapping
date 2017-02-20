import json

import numpy as np
import pandas as pd

import nltk
nltk.download('punkt')

from nltk.stem.lancaster import LancasterStemmer
import datetime

stemmer = LancasterStemmer()

def get_data(filename):
    with open(filename) as data_file:
        return json.load(data_file)

training_data = get_data('resources/documents.json')
training_data = training_data[:5000]

print(training_data[:5])
print(nltk.word_tokenize(training_data[0]['sentence']))

print ("%s sentences in training data" % len(training_data))


# words = []
# classes = []
# documents = []
# ignore_words = ['?', '/']
# # loop through each sentence in our training data
# for pattern in training_data:
#     # tokenize each word in the sentence
#     sentence = pattern['sentence']
#     sentence = sentence.replace('/', ' ')
#
#     w = nltk.word_tokenize(sentence)
#     # add to our words list
#     words.extend(w)
#     # add to documents in our corpus
#     documents.append((w, pattern['class']))
#     # add to our classes list
#     if pattern['class'] not in classes:
#         classes.append(pattern['class'])
#
# # stem and lower each word and remove duplicates
# # words = [stemmer.stem(w.lower()) for w in words if w not in ignore_words]
# words = list(set(words))
#
# # remove duplicates
# classes = list(set(classes))
#
# # print (len(documents), "documents")
# # print (len(classes), "classes", classes)
# # print (len(words), "unique stemmed words", words)
#
# # x = np.array(['88'], dtype='U')
# # needles = np.array(['88H'], dtype='U')
# # print needles, np.where(nltk.word_tokenize(training_data[0]['sentence']) == needles)
# # print needles, np.where(words == needles)
#
# # create our training data
# training = []
# output = []
# # create an empty array for our output
# output_empty = [0] * len(classes)
#
# # training set, bag of words for each sentence
# counter = 0
# for doc in documents:
#     counter = counter+1
#     print(counter, len(documents))
#     # initialize our bag of words
#     bag = []
#     # list of tokenized words for the pattern
#     pattern_words = doc[0]
#     # stem each word
#     pattern_words = [stemmer.stem(word.lower()) for word in pattern_words]
#     # create our bag of words array
#     for w in words:
#         bag.append(1) if w in pattern_words else bag.append(0)
#
#     training.append(bag)
#     # output is a '0' for each tag and '1' for current tag
#     output_row = list(output_empty)
#     output_row[classes.index(doc[1])] = 1
#     output.append(output_row)
#
# print ("# words", len(words))
# # print ("words", words)
#
# print ("# classes", len(classes))
# # print ("classes", classes)
#
# X = np.array(training)
# y = np.array(output)
#
# # print(y)
# # print(bow_placeholder_inputs(X, y))

class Batch():
    def __init__(self, filename, batch_size):
        self.filename = filename
        self.batch_size = batch_size

    def get_data(filename):
        with open(filename) as data_file:
            return json.load(data_file)

    def split(df, train_percent=.6, validate_percent=.2, seed=None):
        np.random.seed(seed)
        perm = np.random.permutation(df.index)
        m = len(df)
        train_end = int(train_percent * m)
        validate_end = int(validate_percent * m) + train_end
        self.train = df.ix[perm[:train_end]]
        self.validate = df.ix[perm[train_end:validate_end]]
        self.test = df.ix[perm[validate_end:]]

batch = Batch('resources/documents.json', 5000)
