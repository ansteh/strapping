'use strict';
const _     = require('lodash');
const entity = require('../brain-entity');
const brain = require('brain');
const net   = new brain.NeuralNetwork();

let activities = [{
  name: 'sleep',
  code: 0.25
},{
  name: 'work',
  code: 0.5
},{
  name: 'eat',
  code: 0.75
},{
  name: 'relax',
  code: 1
},];

let schemaOptions = {
  date: {
    type: 'date',
    pattern: ['month', 'week', 'day', 'hour']
  },
  activity: {
    weight: 1
  }
};

function selectBy(activities, value){
  let distances = _.map(activities, function(activity){
    return Math.abs(activity.code-value);
  });
  return activities[_.indexOf(distances, _.min(distances))];
};

let relais = entity.mirror(schemaOptions);

function train(input, activityCode){
  net.train({ input:  relais.scheme(input), output: { activity: activityCode }});
};

function getActivity(input){
  return selectBy(activities, net.run(input).activity);
};

/*net.train([
  {input: { day: 0.1, hours: 0.5, minutes: 0.5 }, output: {light: 0.4}},
  {input: { meetings: 0.4, day: 0.1, hours: 0.5, minutes: 0.5 }, output: {light: 0.4}},
  {input: { meetings: 0.4, day: 0.1, hours: 0.5, minutes: 0.5 }, output: {light: 0.4}},
  {input: { meetings: 0.4, day: 0.1, hours: 0.5, minutes: 0.5 }, output: {light: 0.4}}
]);*/

train({ date: Date.now() }, 0.5);
console.log(getActivity({ date: Date.now() }));
