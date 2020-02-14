(function() {
  'use strict';
  var NoDataError = function() {
    var temp = Error.apply(this, arguments);
    temp.name = this.name = 'NoDataError';
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
  NoDataError.prototype = Object.create(Error.prototype, {
    constructor: {
      value: NoDataError,
      writable: true,
      configurable: true
    }
  });
  if (!window.NoDataError) {
    window.NoDataError = NoDataError;
  }
})();
