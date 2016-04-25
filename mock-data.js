'use strict';
const Day    = require('mock-realtime').Day;
const _      = require('lodash');
const Random = require('random-js');
const moment = require('moment');

const range = function(min, max){
  let engine = Random.engines.mt19937().autoSeed();
  let distribution = Random.integer(min, max);
  return function() {
    return distribution(engine);
  };
};

const mockDayBiasedInteger = function(min, max, schema){
  let days = {};
  _.forOwn(schema, (options, day) => {
    days[day] = range(options.min, options.max);
  });

  for(var i=0; i<7; i+=1){
    if(_.isUndefined(days[i])){
      days[i] = range(min, max);
    }
  }

  return function(date){
    let key = date.day();
    return days[key]();
  };
};

const mock = (days) => {
  let now = Day({
    hours: { min: 10, max: 13 },
    minutes: { min: 0, max: 59 },
    seconds: { min: 0, max: 59 },
    milliseconds: { min: 0, max: 999 }
  }, Date.now());

  let genAppointments = mockDayBiasedInteger(0, 20, {
    0: { min: 0, max: 0 },
    6: { min: 0, max: 0 }
  });

  var data = [];
  for(var i=0; i<days; i+=1){
    let date = now.next();
    data.push({
      date: date.toString(),
      appointments: genAppointments(date)
    });
  }
  return data;
};

console.log(mock(20));
