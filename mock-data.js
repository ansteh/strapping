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

/*let hours =
  17: { bri: [120, 140], meetings: [0, 3]},
  18: { bri: [140, 170], meetings: [1, 4]},
  19: { bri: [170, 220], meetings: [2, 5]},
  20: { bri: [210, 245], meetings: [4, 6]},
  21: { bri: [230, 250], meetings: [5, 7]},
  22: { bri: [245, 254], meetings: [7, 10]}
};

let options = {
  dates: {
    1: { hours: hours },
    2: { hours: hours },
    3: { hours: hours },
    4: { hours: hours },
    5: { hours: hours }
  }
};*/
