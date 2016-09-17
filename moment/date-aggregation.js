var Sampler = (function(){
  var range = _.curry(function(pattern, start, end) {
    var step = moment(_.clone(start));
    var end = moment(_.clone(end));
    var range = [];
    while(step.isSameOrBefore(end)) {
      range.push(step.clone().toDate());
      step.add(1, pattern);
    }
    return range;
  });

  var sample = function(count, pattern, start) {
    if(_.isUndefined(start)) start = Date.now();
    var end = moment(_.clone(start)).add(count-1, pattern);
    return range(pattern, start, end);
  };

  return {
    sample: sample,
    range: range
  };
}());

var Aggregation = (function() {
  var map = {
    Day: { filter: 'day', step: 'hours' },
    Week: { filter: 'week', step: 'days' },
    Month: { filter: 'month', step: 'week' },
    Year: { filter: 'year', step: 'month' }
  };

  var getStep = function(key) {
    return _.get(map, _.upperFirst(key+'.step'));
  };

  var slice = function(collection, pattern) {
    if(collection.length === 0) return [];
    var end = moment(_.clone(_.first(collection))).endOf(pattern);
    var index = _.findLastIndex(collection, function(date) {
      return moment(date).isSameOrBefore(end);
    });
    if(index > -1) {
      return collection.slice(0, index+1);
    }
  };

  var group = function(collection, pattern) {
    var collector = [], sliced;
    while(collection.length > 0) {
      sliced = slice(collection, pattern);
      collector.push(sliced);
      collection = collection.slice(sliced.length);
    }
    return collector;
  };

  var fetch = function(pattern, date, collection) {
    if(collection.length === 0) return;
    var series = _.first(collection);
    var start = moment(_.clone(_.first(series))).startOf(pattern);
    var ref = moment(_.clone(date)).startOf(pattern);
    if(start.isSame(ref)) {
      collection.shift();
      return series;
    }
  };

  var batch = function(collection, pattern) {
    var grouped = group(_.cloneDeep(collection), pattern);
    var start = _.clone(_.first(_.first(grouped)));
    var end = _.clone(_.last(_.last(grouped)));
    var range = Sampler.range(pattern, start, moment(end).add(1, pattern).toDate());
    var batched = _.map(range, function(date) {
      return {
        date: date,
        values: fetch(pattern, date, grouped) || []
      }
    });
    if(_.get(_.last(batched), 'values', []).length === 0) {
      batched = _.slice(batched, 0, batched.length-1);
    }
    return batched;
  };

  var batchCollectionBy = function(collection, datePath, pattern) {
    var dates = _.map(_.cloneDeep(collection), function(item) {
      return _.get(item, datePath);
    });
    var batchedDates = batch(dates, pattern), item;
    return _.map(batchedDates, function(batchedGroup) {
      return {
        date: batchedGroup.date,
        values: _.map(batchedGroup.values, function() {
          item = _.first(collection);
          collection = _.drop(collection);
          return item;
        })
      };
    });
  };

  var evaluateBatchCollection = function(collection, datePath, evaluate, pattern) {
    return _.map(batchCollectionBy(collection, datePath, pattern), evaluate);
  };

  var getDelimiter = function(pattern) {
    if(pattern === 'day') {
      return 'date';
    }
    return pattern;
  };

  return {
    slice: slice,
    group: group,
    batch: batch,
    batchCollectionBy: batchCollectionBy,
    evaluateBatchCollection: evaluateBatchCollection,
    getDelimiter: getDelimiter
  };
}());

var testAggregation = function() {
  var days = [moment().subtract(40, 'days').toDate()].concat(Sampler.sample(40, 'days'));
  var timeseries = _.map(_.cloneDeep(days), function(date) {
    return {
      date: date,
      value: _.random(10)
    }
  });
  console.log(timeseries);
  //console.log(days);
  console.log(Aggregation.slice(_.cloneDeep(days), 'week').length === 1, Aggregation.slice(_.cloneDeep(days), 'week'), days.length);
  console.log(Aggregation.slice(_.cloneDeep(days), 'month').length === 1, Aggregation.slice(_.cloneDeep(days), 'month'), days.length);
  console.log(Aggregation.group(_.cloneDeep(days), 'month').length === 3);
  console.log(Aggregation.batch(_.cloneDeep(days), 'month').length === 4);
  //console.log(Aggregation.batch(_.cloneDeep(days), 'days').length);
  console.log(Aggregation.batch(_.cloneDeep(days), 'year').length === 1);

  console.log(Aggregation.batch(_.cloneDeep(days), 'week'));
  //console.log(Aggregation.batchCollectionBy(_.cloneDeep(timeseries), 'date', 'week'));
  var sumSeries = function(group) {
    //console.log('sum', values, _.sumBy(values, 'value'));
    return {
      date: group.date,
      value: _.sumBy(group.values, 'value')
    };
  };
  //console.log(Aggregation.evaluateBatchCollection(_.cloneDeep(timeseries), 'date', sumSeries, 'week'));
};
