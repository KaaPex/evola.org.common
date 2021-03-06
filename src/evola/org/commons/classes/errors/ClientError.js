(function() {
  'use strict';
  var ClientError = function() {
    var temp = Error.apply(this, arguments);
    temp.name = this.name = 'ClientError';
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
  ClientError.prototype = Object.create(Error.prototype, {
    constructor: {
      value: ClientError,
      writable: true,
      configurable: true
    }
  });

  if (!window.ClientError) {
    window.ClientError = ClientError;
  }
})();
