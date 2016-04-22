var path = require('path');

function join(paths, dirname){
  if(paths === undefined) paths = [];
  return paths.reduce(function(pathname, name){
    return path.join(pathname, name);
  }, dirname);
};

module.exports = function(dirname){
  var obj = {};

  obj.resolve = function(paths){
    return paths.reduce(function(pathname, next){
      return path.resolve(pathname, next);
    }, dirname);
  };

  obj.join = function(paths){
    return join(paths, dirname);
  };

  obj.chain = function(paths){
    if(paths === undefined) paths = [];
    if(typeof paths == 'string') paths = [paths];
    return {
      join: function(sequence){
        if(sequence === undefined) sequence = [];
        if(typeof sequence == 'string') sequence = [sequence];
        return obj.join(paths.concat(sequence));
      },
      chain: function(sequence){
        if(sequence === undefined) sequence = [];
        if(typeof sequence == 'string') sequence = [sequence];
        return obj.chain(paths.concat(sequence));
      },
      resolve: obj.resolve
    };
  };

  return obj;
};
