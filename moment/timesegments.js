var TimeSegments = (function(_) {
  var Segments = {};

  var rangeDates = _.curry(function(filter, step, date) {
    var start = moment(date).startOf(filter);
    var end = moment(date).endOf(filter);
    var range = [];
    while(start.isSameOrBefore(end)) {
      range.push(start.clone().toDate());
      start.add(1, step);
    }
    return range;
  });

  var map = {
    Day: { filter: 'day', step: 'hours' },
    Week: { filter: 'week', step: 'days' },
    Month: { filter: 'month', step: 'week' },
    Year: { filter: 'year', step: 'month' }
  };

  function getFilter(key) {
    return _.get(map, key+'.filter');
  };

  Segments.getFilter = getFilter;

  function getStep(key) {
    return _.get(map, key+'.step');
  };

  Segments.getStep = getStep;

  function createSegmenter(name) {
    return rangeDates(getFilter(name), getStep(name));
  }

  _.forOwn(map, function(pattern, key) {
    Segments[key] = createSegmenter(key);
  });

  // Segments.Year = function(date) {
  //   return moment.months();
  // };


  var fillGapsOf = _.curry(function(filter, step, datepath, generator, collection) {
    var seed = _.first(collection)[datepath];
    filter = _.upperFirst(filter);
    var range = Segments[filter](seed);

    if(filter === 'Month') {
      range = _.map(range, function(day) {
        return moment(day).add(1, 'days').clone().toDate();
      });
    }

    //console.log(range, collection);
    return _.reduce(range, function (full, date) {
      var needle = date.toString();
      var index = _.findIndex(collection, function(item) {
        return item[datepath].toString() === needle;
      });

      if(index > -1) {
        full.push(collection[index]);
      } else {
        full.push(generator(date));
      }
      return full;
    }, []);
  });

  _.forOwn(map, function(pattern, key) {
    Segments['fillGapsOf'+key] = fillGapsOf(getFilter(key), getStep(key));
  });

  return _.assign(Segments, {});
}(_));

var Shift = (function(moment, _, TimeSegments) {
  var map = {
    Day: { filter: 'day', step: 'hours' },
    Week: { filter: 'week', step: 'days' },
    Month: { filter: 'month', step: 'week' },
    Year: { filter: 'year', step: 'month' }
  };

  var getSegment = function(key, date) {
    //console.log(key);
    return TimeSegments[key](date);
  };

  var fill = function(series, key) {
    var seed = _.first(series) || Date.now();
    if(series.length === 0) series.push(seed);
    var blueprints = getSegment(key, seed);

    var step = TimeSegments.getStep(key);
    var filter = TimeSegments.getFilter(key);
    var collection = _.cloneDeep(series);

    return _.map(blueprints, function(date, index) {
      var next = _.first(collection);
      if(moment(date).get(step) === moment(next).get(step)) {
        collection = _.drop(collection);
        return moment(next).toDate();
      } else {
        return date;
      }
    });
  };

  var range = function(key, start, end) {
    var pattern = _.get(map, key+'.filter');
    var step = moment(_.clone(start));
    var end = moment(_.clone(end));
    var range = [];
    while(step.isSameOrBefore(end)) {
      range.push(step.clone().toDate());
      step.add(1, pattern);
    }
    return range;
  };

  var fillSeries = function(key, start, end, series) {
    //console.log(series);
    var pattern = _.get(map, key+'.filter');
    var step = _.get(map, key+'.step');
    var marks = range(key, start, end);
    return _.map(marks, function(date) {
      return Shift.fill([date], key);
    });
  };

  var getStep = function(key) {
    return _.get(map, key+'.step');
  };

  return {
    getSegment: getSegment,
    fill: fill,
    fillSeries: fillSeries,
    range: range,
    getStep: getStep
  };
}(moment, _, TimeSegments));

//console.log(Shift.getSegment('Day', Date.now()));
// console.log('range 10 days', Shift.range('Day', moment().subtract(9, 'days').toDate(), moment().toDate()));
// console.log('Day', Shift.fill([moment().toDate()], 'Day'));
// console.log('Week', Shift.fill([], 'Week'));
// console.log('Month', Shift.fill([], 'Month'));
// console.log('Year', Shift.fill([], 'Year'));
