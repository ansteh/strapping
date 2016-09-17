var Charts = {};

  Charts.line = function(options) {
    options = options || {};

    function setData(series) {
      return {
        series: [{
          name: 'chart',
          data: series
        }]
      };
    };

    var settings = {
      fullWidth: true,
      showArea: true,
      chartPadding: {
        right: 40
      },
      axisX: {
        type: Chartist.FixedScaleAxis,
        divisor: 5,
        labelInterpolationFnc: function(value) {
          return moment(value).format('D MMM YY');
        }
      },
      axisY: {
        onlyInteger: true,
        low: 0
      },
      series: {
        /*remaining: {
          lineSmooth: Chartist.Interpolation.step(),
          showPoint: false
        },*/
        chart: {
          lineSmooth: false
        }
      },
      plugins: [
        Chartist.plugins.tooltip({
          pointClass: 'my-cool-point'
        })
      ]
    };

    _.assign(settings, options);

    return function(element) {
      var Linechart = new Chartist.Line(element, setData([]), settings);

      Linechart.on('draw', function(data) {
        if(data.type === 'point') {
          //console.log(data.value.y);
          var circle = new Chartist.Svg('circle', {
            cx: [data.x],
            cy: [data.y],
            r: [5],
            'ct:value': moment(data.value.x).format('YYYY-MM-DD HH:mm')+': '+data.value.y,
            //'ct:meta': data.meta,
            class: 'my-cool-point',
          }, 'ct-area');
          data.element.replace(circle);
        }
      });

      function update(series, options, override) {
        //console.log('booking chart: ', series);
        Linechart.update(setData(series), options, override);
      };

      return {
        update: update
      };
    };
  };

  Charts.bookings = function(element) {
    var chart = Charts.line();
    return chart(element);
  };

  Charts.sales = function(element) {
    var chart = Charts.line();
    return chart(element);
  };

  Charts.timeSegment = function(element) {
    var chart = Charts.line()(element);

    var api = {};

    api.getDayAxis = function(labels) {
      return {
        type: Chartist.FixedScaleAxis,
        divisor: labels.length,
        labelInterpolationFnc: function(value, index) {
          return moment(labels[index]).format('HH');
        }
      };
    };

    /*{
      type: Chartist.FixedScaleAxis,
      divisor: xAxis.length,
      labelInterpolationFnc: function(value) {
        return moment(value).format('D MMM');
      }
    }*/

    function getAxis(name, data) {
      //console.log(data);
      var date = _.get(_.first(data), 'x');
      var labels = TimeSegments[_.upperFirst(name)](_.clone(date));
      var axis = api['get'+name+'Axis'];
      if(axis) return axis(labels);

      return {
        type: Chartist.FixedScaleAxis,
        divisor: data.length-1,
        labelInterpolationFnc: function(value) {
          return moment(value).format('D MMM');
        }
      };
    };

    api.update = function(patternName, data, options, override) {
      if(patternName) {
        options = options || {};

        _.assign(options, {
          axisX: getAxis(patternName, data)
        });

        /*_.forEach(data, function(point) {
          point.x = moment(point.x).format('HH');
        });*/

        return chart.update(data, options, true);
      }
    };

    //var days = TimeSegments.Week(new Date());
    /*{
      axisX: {
        type: Chartist.FixedScaleAxis,
        divisor: 5,
        labelInterpolationFnc: function(value) {
          return moment(value).format('D MMM');
        }
      }
    }*/
    return api;
  };

  Charts.areaTimesegmentSeries = function(element) {
    var api = {};
    var chart = Charts.line()(element);

    api.getDayAxis = function(labels) {
      //console.log('labels', labels);
      return {
        type: Chartist.FixedScaleAxis,
        divisor: labels.length,
        labelInterpolationFnc: function(value, index) {
          return moment(labels[index]).format('HH');
        }
      };
    };

    function getAxis(name, data) {

      //console.log(data);
      var date = _.get(_.first(data), 'x');
      var labels = TimeSegments[_.upperFirst(name)](_.clone(date));
      var axis = api['get'+name+'Axis'];
      if(axis) return axis(labels);

      return {
        type: Chartist.FixedScaleAxis,
        divisor: data.length-1,
        labelInterpolationFnc: function(value) {
          return moment(value).format('D MMM');
        }
      };
    };

    api.update = function(patternName, series, options, override) {
      var data = _.last(series);
      // console.log('chartData', patternName, data);
      // console.log('provided data:', getSetDatesOf(data));
      if(patternName) {
        options = options || {};

        _.assign(options, {
          axisX: getAxis(patternName, data)
        });
        //console.log('chart.update', data);
        return chart.update(data, options, true);
      }
    };

    return api;
  };
