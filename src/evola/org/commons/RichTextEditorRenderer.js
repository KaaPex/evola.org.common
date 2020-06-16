/*!
 * SAPUI5

(c) Copyright 2009-2019 SAP SE. All rights reserved
 */
// Provides default renderer for control sap.ui.richtexteditor.RichTextEditor
sap.ui.define(
  ['sap/ui/core/Renderer'],
  function (Renderer) {
    'use strict';

    /**
     * RichTextEditorRenderer
     * @class
     * @static
     * @author Malte Wedel, Andreas Kunz
     */
    var RichTextEditorRenderer = {};

    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager} rm The RenderManager that can be used for writing to the Render-Output-Buffer.
     * @param {sap.ui.richtexteditor.RichTextEditor}
     *            oRichTextEditor The RichTextEditor control that should be rendered.
     */
    RichTextEditorRenderer.render = function (rm, oRichTextEditor) {
      var oToolbarWrapper = oRichTextEditor.getAggregation('_toolbarWrapper');
      var bCustomToolbar = oToolbarWrapper && oRichTextEditor._bCustomToolbarRequirementsFullfiled;

      rm.write('<div');
      rm.writeControlData(oRichTextEditor);
      if (oRichTextEditor.getEditorType() == 'TinyMCE4') {
        rm.writeAttribute('data-sap-ui-preserve', oRichTextEditor.getId());
      }
      rm.addClass('sapUiRTE');
      if (oRichTextEditor.getRequired()) {
        rm.addClass('sapUiRTEReq');
      }
      if (oRichTextEditor.getUseLegacyTheme()) {
        rm.addClass('sapUiRTELegacyTheme');
      }
      if (bCustomToolbar) {
        rm.addClass('sapUiRTEWithCustomToolbar');
      }

      rm.writeClasses();
      rm.addStyle('width', oRichTextEditor.getWidth());
      rm.addStyle('height', oRichTextEditor.getHeight());
      rm.writeStyles();
      if (oRichTextEditor.getTooltip_AsString()) {
        // ensure not to render null
        rm.writeAttributeEscaped('title', oRichTextEditor.getTooltip_AsString());
      }
      rm.write('>');

      if (bCustomToolbar) {
        oToolbarWrapper.addStyleClass('sapUiRTECustomToolbar');
        rm.renderControl(oToolbarWrapper);
      }

      // Call specialized renderer method if it exists
      var sRenderMethodName = 'render' + oRichTextEditor.getEditorType() + 'Editor';
      if (this[sRenderMethodName] && typeof this[sRenderMethodName] === 'function') {
        this[sRenderMethodName].call(this, rm, oRichTextEditor);
      }

      rm.write('</div>');
    };

    return RichTextEditorRenderer;
  },
  /* bExport= */ true
);
