'use strict';
const _ = require('lodash');

function mirror(schema){
  let relais = {};

  relais.scheme = function(input){
    _.forOwn(input, function(value, key){
      let options = schema[key];
      input[key] = value/options.weight;

      if(options.input){
        input[key] = options.input(input[key]);
      }
    });
    return input;
  };

  relais.reverse = function(output){
    _.forOwn(output, function(value, key){
      let options = schema[key];
      output[key] = value*options.weight;

      if(options.output){
        output[key] = options.output(output[key]);
      }
    });
    return output;
  };

  return relais;
};

exports.mirror = mirror;
