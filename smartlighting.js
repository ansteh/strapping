'use strict';
const realtime = require('mock-realtime');
const Day      = realtime.Day;
const _        = require('lodash');
const moment   = require('moment');
const Random = require('random-js');

const range = function(min, max){
  let engine = Random.engines.mt19937().autoSeed();
  let distribution = Random.integer(min, max);
  return function() {
    return distribution(engine);
  };
};

let hours = {
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
};

function simulator(){
  let now = Day({
    hours: { min: 17, max: 22 },
    minutes: { min: 0, max: 59 },
    seconds: { min: 0, max: 59 },
    milliseconds: { min: 0, max: 999 }
  }, Date.now());

  _.forOwn(hours, function(options, hour){
    options.bri = range(options.bri[0], options.bri[1]);
    options.meetings = range(options.meetings[0], options.meetings[1]);
  });

  let dates = [1,2,3,4,5];

  function next(){
    let current = now.next();

    if(_.includes(dates, current.day())){
      return {
        date: current.toDate(),
        meetings: hours[current.hours()]['meetings'](),
        bri: hours[current.hours()]['bri']()
      };
    } else {
      return next();
    }
  }
  return next;
};

let generator = simulator();

for(var i=0; i<7; i+=1){
  console.log(generator());
}
