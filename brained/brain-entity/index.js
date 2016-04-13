'use strict';
exports.mirror = require('./mirror');
exports.prepare = require('./prepare');

/*let inputOptions = {
  date: {
    type: 'date',
    pattern: ['month', 'week', 'day', 'hour']
  },
  test: {
    weight: 5
  }
};

console.log(exports.prepare(inputOptions));
let transition = exports.mirror(inputOptions);
let tarnsitioned = transition.scheme({ date: Date.now(), test: 4 });
console.log(tarnsitioned);*/
