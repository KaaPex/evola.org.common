sap.ui.define([], function() {
  'use strict';

  /**
   * Create confirm dialog content
   * @param {String} sText - text field
   * @param {Boolean} [bComment] - comment is required
   * @param {String} [sPlaceholder] - text area placeholder
   * @param {Function} [fn] - callback function on comment change
   * @param {Array} [additionalItems] - additional items for dialog
   * @return {sap.m.VBox} - dialog content
   */
  var createConfirmDialog = function(sText, bComment, sPlaceholder, fn, additionalItems) {
    var items = sText
      ? [
          new sap.m.Text({
            text: sText
          })
        ]
      : [];
    if (bComment) {
      items.push(
        new sap.m.TextArea({
          cols: 50,
          width: '100%',
          valueLiveUpdate: true,
          liveChange: fn,
          placeholder: sPlaceholder ? sPlaceholder : 'Введите комментарий'
        }).addStyleClass('textarea')
      );
    }
    if (Array.isArray(additionalItems) && additionalItems.length) {
      items = Array.concat(items, additionalItems);
    }
    return new sap.m.VBox({
      items: items
    });
  };

  /**
   * Operation Class
   * @constructor
   */
  var Operation = function() {};

  /**
   * Confirm current operation
   * @param {sap.ui.commons.MessageBox.Icon} icon - dialog icon
   * @param {String} sTitle - dialog title
   * @param {String} sText - operation confirm text
   * @param {Boolean} [bComment] - comment is required
   * @param {String} [sPlaceholder] - text area placeholder
   * @param {Array} [additionalItems] - additional items for dialog
   * @return {Promise} - Promise pending instance
   */
  Operation.confirm = function(icon, sTitle, sText, bComment, sPlaceholder, additionalItems) {
    var comment = '';
    var callback = function(oEvent) {
      comment = oEvent.getParameter('value');
    };

    if (Array.isArray(sPlaceholder)) {
      additionalItems = sPlaceholder;
    }

    return new Promise(function(resolve) {
      sap.m.MessageBox.show(
        createConfirmDialog(sText, bComment, sPlaceholder, callback.bind(this), additionalItems),
        {
          icon: icon || sap.m.MessageBox.Icon.QUESTION,
          styleClass: 'sapUiSizeCompact',
          title: sTitle,
          actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
          onClose: function(action) {
            resolve({ action: action, comment: comment });
          }
        }
      );
    });
  };

  return Operation;
});
