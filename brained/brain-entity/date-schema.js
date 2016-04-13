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

const weights = {
  'year': 2500,
  'month': 11,
  'week': 52,
  'day': 6,
  'date': 31,
  'hour': 23,
  'minute': 59,
  'second': 59,
  'millisecond': 999
};

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

function prepare(schema){
  let scheme = {};
  _.forEach(schema, function(entity){
    scheme[entity] = {
      weight: weights[entity]
    };
  });
  return scheme;
};

exports.scheme = _.curry(parse);
exports.prepare = prepare;

//console.log(exports.scheme(Date.now(), entities));
