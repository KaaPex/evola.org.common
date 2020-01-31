sap.ui.define(['sap/m/QuickViewGroupElement', 'sap/m/Link'], function(QuickViewGroupElement, Link) {
  'use strict';

  var logger = jQuery.sap.log.getLogger('QuickViewGroupElement', jQuery.sap.log.Level.ERROR);

  var GroupElement = QuickViewGroupElement.extend(
    'evola.org.common.enhances.QuickViewGroupElement',
    {
      metadata: {
        events: {
          /**
           * Event is fired when the user triggers the link control.
           */
          press: { allowPreventDefault: true }
        }
      }
    }
  );

  /**
   * Returns a control that is associated with the label of the group element.
   * @param {string} sQuickViewPageId The page to which the element navigates when clicked.
   * @private
   */
  GroupElement.prototype._getGroupElementValue = function(sQuickViewPageId) {
    logger.debug('_getGroupElementValue');
    var oControl = QuickViewGroupElement.prototype._getGroupElementValue.apply(this, arguments);
    if (oControl instanceof Link) {
      // attach press event
      oControl.attachPress(this.firePress, this);
    }
    return oControl;
  };

  return GroupElement;
});
