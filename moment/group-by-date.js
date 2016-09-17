var Group = (function(_) {
  var groupByDatepath = _.curry(function(pattern, datepath, collection) {
    return _.groupBy(collection, function(item) {
      return moment(_.get(item, datepath)).format(pattern);
    });
  });

  var Patterns = {
    Hour: 'YYYY-MM-DD-HH',
    Day: 'YYYY-MM-DD',
    Week: 'YYYY-WW',
    Month: 'YYYY-MM',
    Year: 'YYYY'
  };

  var res = {
    byDatepath: groupByDatepath,
    Patterns: Patterns
  };

  _.forOwn(Patterns, function(pattern, key) {
    res['by'+key] = groupByDatepath(pattern);
  });

  return res;
}(_));
