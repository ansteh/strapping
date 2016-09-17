console.log(Shift.getSegment('Day', Date.now()));
console.log('range 10 days', Shift.range('Day', moment().subtract(9, 'days').toDate(), moment().toDate()));
console.log('Day', Shift.fill([moment().toDate()], 'Day'));
console.log('Week', Shift.fill([], 'Week'));
console.log('Month', Shift.fill([], 'Month'));
console.log('Year', Shift.fill([], 'Year'));

var fillChartSeries = function(key, start, end, series) {
  var values = _.chain(series)
    .flatten()
    .filter(function(value) {
      return _.get(value, 'y', 0) > 0;
    })
    .value();
  //console.log('values', values, _.map(values, 'y'));

  var dates = _.map(values, 'x');
  var blueprints = Shift.fillSeries(key, start, end, dates);
  var step = Shift.getStep(key);
  //console.log(blueprints);
  var value = values.shift();
  var result = _.map(blueprints, function(blueprint) {
    return _.map(blueprint, function(date) {
      if(value && moment(date).isSame(moment(value.x).startOf(step))) {
        // console.log('found');
        // if(value.y > 0) {
        //   console.log('match', value);
        // }
        var res = _.cloneDeep(value);
        value = values.shift();
        return res;
      } else {
        return {
          x: date,
          y: 0
        }
      }
    });
  });
  // console.log('values.length', values.length);

  return result;
};

var getSetDatesOf = function(data) {
  return  _.chain(data)
    .flatten()
    .filter(function(value) {
      return _.get(value, 'y', 0) > 0;
    })
    .value();
};

var alignChartSeries = function(key, chartSeries) {
  var first = chartSeries[0];
  var second = chartSeries[1];

  var getBefore = function(a, b) {
    if(_.isUndefined(a)) {
      return b;
    }
    if(_.isUndefined(b)) {
      return a;
    }
    return moment(a).isBefore(moment(b)) ? a : b;
  };
  var getAfter = function(a, b) {
    if(_.isUndefined(a)) {
      return b;
    }
    if(_.isUndefined(b)) {
      return a;
    }
    return moment(a).isAfter(moment(b)) ? a : b;
  };
  var start = getBefore(_.get(first, '0.0.x'), _.get(second, '0.0.x'));
  var end = getAfter(_.get(_.last(first), '0.x'), _.get(_.last(second), '0.x'));

  // console.log('fillChartSeries', chartSeries, start, end, second);
  // console.log(fillChartSeries(key, start, end, first));
  // console.log(fillChartSeries(key, start, end, second));
  return [fillChartSeries(key, start, end, first), fillChartSeries(key, start, end, second)];
};

//console.log('fillSeries weeks days', Shift.fillSeries('Week', moment().subtract(9, 'days').toDate(), moment().toDate(), []));

var createSeries = function(key, chartSeries) {
  var segmented = alignChartSeries(key, chartSeries);
  return _.reduce(segmented, function(sets, series) {
    return _.zip(sets, series);
  });
};
