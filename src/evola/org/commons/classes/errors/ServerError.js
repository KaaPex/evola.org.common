(function() {
  'use strict';
  var ServerError = function() {
    var temp = Error.apply(this, arguments);
    temp.name = this.name = 'ServerError';
    this.message = temp.message;
    if (Object.defineProperty) {
      Object.defineProperty(this, 'stack', {
        get: function() {
          return temp.stack;
        },
        configurable: true
      });
    } else {
      this.stack = temp.stack;
    }
  };
  //inherit prototype using ECMAScript 5 (IE 9+)
  ServerError.prototype = Object.create(Error.prototype, {
    constructor: {
      value: ServerError,
      writable: true,
      configurable: true
    }
  });
  if (!window.ServerError) {
    window.ServerError = ServerError;
  }
})();
