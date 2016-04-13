'use strict';
const dates = require('./date-schema.js');
const _     = require('lodash');

function prepare(options){
  let schema = {};
  _.forOwn(options, function(property, key){
    if(_.isObject(property)){
      if(property.type === 'date'){
        _.merge(schema, dates.prepare(property.pattern));
      } else {
        schema[key] = property;
      }
    }
  });
  return schema;
};

module.exports = prepare;
