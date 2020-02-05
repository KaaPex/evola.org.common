sap.ui.define(
  [
    'evola/org/commons/polyfills/Date',
    'evola/org/commons/polyfills/Object',
    'evola/org/commons/polyfills/Promise',
    'evola/org/commons/polyfills/Array'
  ],
  function() {
    'use strict';

    if (!Map.prototype.values) {
      Map.prototype.values = function() {
        var aValues = [];
        this.forEach(function(value) {
          aValues.push(value);
        });
        return aValues;
      };
    }
  }
);
