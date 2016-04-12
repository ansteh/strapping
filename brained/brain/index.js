'use strict';
const brain   = require('brain');
const net     = new brain.NeuralNetwork();
const entity  = require('../brain-entity');
const _       = require('lodash');

let inputWeights = {
  meetings: 20,
  day: 6,
  hours: 23,
  minutes: 59,
  light: 1
};

let inputOptions = {
  meetings: {
    weight: 20
  },
  day: {
    weight: 6
  },
  hours: {
    weight: 23
  },
  minutes: {
    weight: 59
  },
  light: {
    weight: 1
  }
};

let transition = entity.mirror(inputOptions);
let tarnsitioned = transition.scheme({ meetings: 10, day: 5, hours: 23, minutes: 50 });
console.log(tarnsitioned);
let reversed = transition.reverse(tarnsitioned);
console.log(reversed);

net.train([
  {input: { meetings: 0.4, day: 0.1, hours: 0.5, minutes: 0.5 }, output: {light: 0.4}},
  {input: { meetings: 0.4, day: 0.1, hours: 0.5, minutes: 0.5 }, output: {light: 0.4}},
  {input: { meetings: 0.4, day: 0.1, hours: 0.5, minutes: 0.5 }, output: {light: 0.4}},
  {input: { meetings: 0.4, day: 0.1, hours: 0.5, minutes: 0.5 }, output: {light: 0.4}}
]);

var output = net.run({ meetings: 0.4, day: 0.1, hours: 0.5, minutes: 0.5 });
console.log(output);
