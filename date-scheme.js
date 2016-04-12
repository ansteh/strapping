'use strict';
const moment = require('moment');
const _      = require('lodash');

const entities = [
  'year',
  'month',
  'week',
  'day',
  'date',
  'hour',
  'minute',
  'second',
  'millisecond'
];

function parse(date, schema){
  let instance = moment(date);
  let details = {};
  _.forEach(schema, function(entity){
    if(_.includes(entities, entity)){
      details[entity] = instance.get(entity);
    }
  });
  return details;
};

exports.scheme = _.curry(parse);

//console.log(exports.scheme(Date.now(), entities));
