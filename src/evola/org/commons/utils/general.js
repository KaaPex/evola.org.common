sap.ui.define(['sap/ui/core/routing/History'], function(History) {
  'use strict';

  var localStack = [];

  return {
    /**
     * Get Router from Component
     * @returns {sap.ui.core.routing.Router} - router object
     */
    getRouter: function() {
      return (this.getOwnerComponent && this.getOwnerComponent().getRouter()) || null;
    },

    /**
     * Check if history is empty
     * @return {boolean} - is history empty
     */
    isHistoryEmpty: function() {
      var oHistory = History.getInstance();
      var sPreviousHash = oHistory.getPreviousHash();
      return !sPreviousHash;
    },

    /**
     * Nav Back in route history from current view
     * @param {String} sDefaultRoute
     */
    navBack: function(sDefaultRoute) {
      if (!this.isHistoryEmpty()) {
        window.history.go(-1);
      } else {
        this.getRouter() && this.getRouter().navTo(sDefaultRoute || 'appMain', {}, true);
      }
    },

    /**
     * Get model object from View
     * @param {string} sName - имя модели
     * @returns {sap.ui.model.Model} - model
     */
    getModel: function(sName) {
      return (
        (this.getView && this.getView().getModel(sName)) ||
        (this.getOwnerComponent && this.getOwnerComponent().getModel(sName)) ||
        null
      );
    },

    /**
     * Return control object from View by it's ID or by frame absolute path
     * @param {string} sId - control ID
     * @returns {sap.ui.core.Control|null|undefined} - control object
     */
    getById: function(sId) {
      return (this.getView && this.getView().byId(sId)) || sap.ui.getCore().byId(sId);
    },

    /**
     * Get control by Class Name, return first in search result
     * @param {String} sSelector - selector string to find
     * @returns {sap.ui.core.Control|null|undefined} - control object
     */
    getByClassName: function(sSelector) {
      var controls = $(sSelector).control();

      if (controls && controls.length) {
        return controls[0];
      }
    },

    /**
     * Get text value from i18n
     * @param {Object} owner - view object
     * @param {string} sText - text ID
     * @param {string[]} aArgs - arguments
     * @returns {string} - result text
     */
    getText: function(owner, sText, aArgs) {
      var i18n =
        (owner && owner.getView && owner.getView().getModel('i18n')) ||
        (owner && owner.getModel && owner.getModel('i18n')) ||
        sap.ui.getCore().getModel('i18n');
      return i18n ? i18n.getResourceBundle().getText(sText, aArgs) : '';
    },

    /**
     * Normalize oData object
     * @param {Object} object - object witch should be normalize
     * @param {Array} [aKeys] - additional keys
     * @return {Object} - normalized object
     */
    normalizeObject: function(object, aKeys) {
      var removeKeys = function(obj, keys) {
        for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            switch (typeof obj[prop]) {
              case 'object':
                if (keys.indexOf(prop) !== -1) {
                  delete obj[prop];
                } else {
                  removeKeys(obj[prop], keys);
                }
                break;
              default:
                if (keys.indexOf(prop) > -1) {
                  delete obj[prop];
                }
                break;
            }
          }
        }
      };
      removeKeys(object, aKeys && aKeys.length ? ['__metadata'].concat(aKeys) : ['__metadata']);
      // check results property
      return object;
    },

    /**
     * Check if an object is a Promise
     * @param {Object} [object] - checked promise
     * @return {boolean} - result of checking
     */
    isPromise: function(object) {
      if (Promise && Promise.resolve) {
        if (!object) {
          return true;
        }
        return Promise.resolve(object) === object;
      } else {
        throw new Error('Promise not supported in your environment');
      }
    },

    /**
     *
     * @param {Object} oField - DOM field
     * @param  {String|Any} value - value to insert
     */
    insertValueAtCursor: function(oField, value) {
      //IE support
      if (document.selection) {
        oField.focus();
        var sel = document.selection.createRange();
        sel.text = value;
      }
      //MOZILLA and others
      else if (oField.selectionStart || oField.selectionStart === '0') {
        var startPos = oField.selectionStart;
        var endPos = oField.selectionEnd;
        oField.value =
          oField.value.substring(0, startPos) +
          value +
          oField.value.substring(endPos, oField.value.length);

        oField.selectionStart = startPos + value.length;
        oField.selectionEnd = startPos + value.length;
      } else {
        oField.value += value;
      }
    },

    cancelCallStack: function(func) {
      if (!_.isFunction(func)) {
        return;
      }
      if (localStack[func]) {
        window.clearTimeout(localStack[func]);
      }
    },

    callStackTimeoutFunc: function(func, timeout) {
      if (!_.isFunction(func)) {
        return;
      }

      if (localStack[func]) {
        window.clearTimeout(localStack[func]);
      }
      localStack[func] = window.setTimeout(func, timeout);
    },

    /**
     * Generate GUID
     * @return {string|*|void} - new GUID
     */
    uuidv4: function() {
      var crypto = window.crypto || window.msCrypto;
      if (crypto) {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function(c) {
          return (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(
            16
          );
        });
      } else {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      }
    }
  };
});
