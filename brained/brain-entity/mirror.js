'use strict';
const _         = require('lodash');
const dates     = require('./date-schema.js');
const prepare   = require('./prepare');

function mirror(schemaOptions){
  let schema = prepare(schemaOptions);
  let relais = {};

  relais.prepare = function(rawInput){
    let input = {};
    _.forOwn(rawInput, function(value, key){
      let property = schemaOptions[key];
      if(_.isObject(property)){
        if(property.type === 'date'){
          _.merge(input, dates.scheme(value, property.pattern));
        } else {
          input[key] = value;
        }
      }
    });
    return input;
  };

  relais.scheme = function(input){
    input = relais.prepare(input);
    _.forOwn(input, function(value, key){
      let options = schema[key];
      input[key] = value/options.weight;

      if(options.input){
        input[key] = options.input(input[key], input);
      }
    });
    return input;
  };

  relais.reverse = function(output){
    _.forOwn(output, function(value, key){
      let options = schema[key];
      output[key] = value*options.weight;

      if(options.output){
        output[key] = options.output(output[key], output);
      }
    });
    return output;
  };

  return relais;
};

module.exports = mirror;
