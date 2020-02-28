sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'], function(
  jQuery,
  library,
  Control
) {
  'use strict';

  var Container = Control.extend('evola.org.commons.Container', {
    metadata: {
      library: 'evola.org.commons',
      properties: {
        /**
         * Width of the container
         */
        width: { type: 'string', group: 'Dimension', defaultValue: null },

        /**
         * Height of the container
         */
        height: { type: 'string', group: 'Dimension', defaultValue: null },
        /**
         * Determines whether the <code>Container</code> is enabled (default is set to <code>true</code>).
         * A disabled <code>Container</code> has different colors maybe.
         */
        enabled: { type: 'boolean', group: 'Behavior', defaultValue: true },
        hoverable: { type: 'boolean', group: 'Behavior', defaultValue: true },
        display: {
          type: 'string',
          defaultValue: 'inherit'
        }
      },
      defaultAggregation: 'content',
      aggregations: {
        content: { singularName: 'content' } // default type is "sap.ui.core.Control", multiple is "true"
      },
      events: {
        /**
         * Fired when the user clicks or taps on the control.
         */
        press: {}
      }
    }
  });

  Container.prototype.init = function() {
    if (sap.ui.core.Control.prototype.init) {
      // check whether superclass implements the method
      sap.ui.core.Control.prototype.init.apply(this, arguments); // call the method with the original arguments
    }

    this._controllPressed = false;
  };

  Container.prototype.onBeforeRendering = function() {};

  /**
   * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
   *
   * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
   * @param {sap.ui.unified.Calendar} oControl an object representation of the control that should be rendered
   */
  Container.prototype.renderer = function(oRm, oControl) {
    oRm.write('<div');
    oRm.writeControlData(oControl);
    oRm.writeClasses();

    if (oControl.getDisplay()) {
      oRm.addStyle('display', oControl.getDisplay());
    }
    oRm.writeStyles();

    var dataIntro = oControl.getProperty('data-intro');
    if (dataIntro) {
      oRm.writeAttribute('data-intro', dataIntro);
    }

    oRm.write('>');

    // loop over all child Controls,
    var aChildren = oControl.getContent();
    aChildren.forEach(function(cChildren) {
      oRm.renderControl(cChildren);
    });

    // close container
    oRm.write('</div>');
  };

  Container.prototype.exit = function() {};

  Container.prototype.onAfterRendering = function() {
    //if I need to do any post render actions, it will happen here
    if (sap.ui.core.Control.prototype.onAfterRendering) {
      sap.ui.core.Control.prototype.onAfterRendering.apply(this, arguments); //run the super class's method first
    }
  };

  /**
   * Function is called when tap occurs on button.
   * @param {jQuery.Event} oEvent - the touch event.
   * @private
   */
  Container.prototype.ontap = function(oEvent) {
    // mark the event for components that needs to know if the event was handled by the button
    oEvent.setMarked();

    // fire tap event
    if (this.getEnabled() && this.getVisible()) {
      // note: on mobile, the press event should be fired after the focus is on the button
      if (oEvent.originalEvent && oEvent.originalEvent.type === 'touchend') {
        this.focus();
      }

      this.firePress({
        /* no parameters */
      });
    }
  };

  return Container;
});
