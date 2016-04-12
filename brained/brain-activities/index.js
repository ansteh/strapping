'use strict';
const _     = require('lodash');
const dates = require('../date-schema');
const brain = require('brain');
const net   = new brain.NeuralNetwork();

let inputWeights = {
  day: 6,
  hour: 23,
  minute: 59
};

const range = _.curry(function(scheme, input){
  _.forOwn(input, function(value, key){
    input[key] = value/scheme[key];
  });
  return input;
});

let activities = range(inputWeights);

net.train([
  {input: { day: 0.1, hours: 0.5, minutes: 0.5 }, output: {light: 0.4}},
  {input: { meetings: 0.4, day: 0.1, hours: 0.5, minutes: 0.5 }, output: {light: 0.4}},
  {input: { meetings: 0.4, day: 0.1, hours: 0.5, minutes: 0.5 }, output: {light: 0.4}},
  {input: { meetings: 0.4, day: 0.1, hours: 0.5, minutes: 0.5 }, output: {light: 0.4}}
]);

console.log(dates);
