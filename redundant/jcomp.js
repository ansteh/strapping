function distinct(reference, json){
  var resolved = {}, keys = Object.keys(reference), resolvedProp, key, value;
  for(var i = 0; i < keys.length; i += 1){
    key = keys[i];
    value = reference[key];
    resolvedProp = distinctProperty(value, json[key]);
    if(resolvedProp) resolved[key] = resolvedProp;
  }
  if(Object.keys(resolved).length > 0) return resolved;
};

function distinctProperty(reference, value){
  if(typeof reference === 'function')
    return;
  if(typeof reference === 'string' && reference !== value)
    return distinctString(reference, value);
  if(typeof reference === 'object')
    return distinct(reference, value);
};

function distinctString(reference, value){
  return {
    $origin: reference,
    $set: value
  };
};

function pathExists(path, json){
  var keys = path.split('.'), subJSON = json, key;
  for(var i = 0; i < keys.length; i += 1){
    key = keys[i];
    subJSON = subJSON[key];
    if(typeof subJSON === 'undefined') return;
  }
  return subJSON;
};

function createChain(value){
  var chain = function(cb){
      cb(value);
      return {
        on: chain
      };
  };
  return {
    on: chain
  };
};

/*module.exports = {
  discrepance: function(reference, json){
    return distinct(reference, json);
  },
  path: function(path, json){
    return pathExists(path, json);
  }
};*/
