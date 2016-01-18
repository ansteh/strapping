var Scope = (function(){
  var events = (function(){
    var topics = {};
    var hOP = topics.hasOwnProperty;
    return {
      subscribe: function(topic, listener) {
        if(!hOP.call(topics, topic)) topics[topic] = [];
        var index = topics[topic].push(listener) -1;
        return {
          remove: function() {
            delete topics[topic][index];
          }
        };
      },
      publish: function(topic, info) {
        if(!hOP.call(topics, topic)) return;
        topics[topic].forEach(function(item) {
        	item(info != undefined ? info : {});
        });
      }
    };
  })();

  var Input = (function(){
    var isValid = function(state, validation){
      var validated = validation(state.input.val());
      var message = { state: state};
      if(validated === true){
        state.isValid = true;
      } else {
        state.isValid = false;
        message.error = validated;
      }
      events.publish('update', message);
    };

    return function(input){
      var state = {
        input: input
      };

      var component = {
        isValid: isValid(state, component.validate)
      };

      return component;
    };
  }());

  var Form = (function(){
    var isValid = function(state){
      return function(){
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

    return function(form){
      var state = {
        inputs: {}
      };

      var component = {
        isValid: isValid(state)
      };

      events.subscribe('update', function(message){

      });

      return component;
    };
  }());

}());
