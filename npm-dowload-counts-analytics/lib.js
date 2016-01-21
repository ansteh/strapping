function accumulateDownloads(downloads){
  var sum = 0;
  return downloads.map(function(point){
    point.sum = sum + point.downloads;
    sum = point.sum;
    return point;
  });
};

function downloadsGrowthByDif(downloads){
    var past = downloads[0]['downloads'];
    return downloads.reduce(function(rates, point, index){
      if(index !== 0){
        rates.push(point.downloads/past);
        past += point.downloads;
      }
      return rates;
    }, [0]);
  };
