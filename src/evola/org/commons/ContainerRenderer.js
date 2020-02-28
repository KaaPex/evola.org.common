/*!
 * ${copyright}
 */

sap.ui.define(
  [],
  function() {
    'use strict';

    /**
     * TileContent renderer.
     * @namespace
     */
    var ContainerRenderer = {};

    var writeAttribute = function(oRm, oControl, sName) {
      if (!oRm || !oControl || !sName) {
        return;
      }

      var oValue = oControl.getProperty(sName);
      if (oValue) {
        oRm.writeAttribute(sName, oValue);
      }
    };

    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer
     * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered
     */
    ContainerRenderer.render = function(oRm, oControl) {
      oRm.write('<div');
      oRm.writeControlData(oControl);
      oRm.addClass('evolaContainer');
      // reder overflow for mouse over behaviour
      if (oControl.getHoverable()) {
        oRm.addClass('evolaContainer--hoverable');
      }
      oRm.writeClasses();

      if (oControl.getWidth()) {
        oRm.addStyle('width', oControl.getWidth());
      }
      if (oControl.getHeight()) {
        oRm.addStyle('height', oControl.getHeight());
      }
      if (oControl.getDisplay()) {
        oRm.addStyle('display', oControl.getDisplay());
      }
      oRm.writeStyles();

      oRm.write('>');

      // loop over all child Controls,
      var aChildren = oControl.getContent();
      aChildren.forEach(function(cChildren) {
        oRm.renderControl(cChildren);
      });

      // close container
      oRm.write('</div>');
    };

    return ContainerRenderer;
  },
  /* bExport= */ true
);
