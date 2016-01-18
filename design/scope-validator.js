var validateScope = (function(){
  var getValue = function(anchor){
    return function(){
      return anchor.val();
    };
  };

  var listen = function(state, validate){
    return function(listener){
      listener(state.input, validate);
    };
  };

  var inputIsValid = function(state, validation){
    return function(){
      state.valid = validation(state.input.val());
      return state.valid;
    };
  };

  var InputValidation = function(selector, anchor, validation){
    var state = {
      name: selector,
      input: anchor.find('#'+selector),
      valid: false
    };

    var validator = {};
    validator.val = getValue(state.input);
    validator.validate = inputIsValid(state, validation);
    validator.listen = listen(state, validator.validate);
    validator.valid = function(){
      return state.valid;
    };
    validator.consequence = function(cb){

    };

    return validator;
  };

  var getValueBy = function(collection){
    return function(selector){
      return collection[selector];
    };
  };

  var pushInputsTo = function(collection, anchor){
    return function(selector, validation){
      var input = InputValidation(selector, anchor, validation);
      collection[selector] = input;
      return input;
    };
  };

  var isFormValid = function(state){
    return function(isValid){
      var valid = true;
      _.forOwn(state.inputs, function(input){
        if(input.valid() === false){
          valid = false;
          return false
        }
      });
      return valid;
    };
  };

  var FormValidation = function(selector){
    var state = {
      anchor: jQuery('#'+selector),
      inputs: {}
    };

    return {
      get: getValueBy(state.inputs),
      push: pushInputsTo(state.inputs, state.anchor),
      valid: isFormValid(state)
    };
  };

  return function(selector){
    return FormValidation(selector);
  };
}());
