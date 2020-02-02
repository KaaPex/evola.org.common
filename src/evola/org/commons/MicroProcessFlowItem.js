// Provides control MicroProcessFlowItem.
sap.ui.define(
  [
    'jquery.sap.global',
    './library',
    'sap/ui/core/Control',
    'evola/org/commons/MicroProcessFlow',
    'sap/ui/core/ValueState'
  ],
  function(jQuery, library, Control, MicroProcessFlow, ValueState) {
    'use strict';

    var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle('evola.org.commons');

    var DefaultIcons = {
      Error: 'sap-icon://status-negative',
      None: null,
      Success: 'sap-icon://status-positive',
      Warning: 'sap-icon://status-critical'
    };

    /**
     * Constructor for a new MicroProcessFlowItem.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @class
     * Holds information about one node in the micro process flow.
     *
     * @extends sap.ui.core.Control
     *
     * @author SAP SE
     * @version 1.54.4
     *
     * @constructor
     * @public
     * @alias sap.suite.ui.commons.MicroProcessFlowItem
     * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
     */
    var MicroProcessFlowItem = Control.extend('evola.org.commons.MicroProcessFlowItem', {
      metadata: {
        library: 'evola.org.commons',
        properties: {
          /**
           * Key of the node.
           */
          key: {
            type: 'string',
            group: 'Misc',
            defaultValue: null
          },
          /**
           * Icon that is displayed inside the node.
           * <br>By default, an icon that corresponds to the node's <code>state</code> is used.
           */
          icon: {
            type: 'string',
            group: 'Appearance',
            defaultValue: null
          },
          /**
           * Title associated with this node.
           * <br>The title is displayed as a tooltip when the user hovers over the node.
           * This title can also be used by screen reader software.
           */
          title: {
            type: 'string',
            group: 'Misc',
            defaultValue: null
          },
          /**
           * State associated with this node.<br>The state defines the semantic color applied to
           * the node. Available states include <code>Standard</code> (neutral), <code>Error</code>
           * (negative), <code>Success</code> (positive), and <code>Warning</code> (critical).
           */
          state: {
            type: 'sap.ui.core.ValueState',
            group: 'Appearance',
            defaultValue: ValueState.Standard
          },
          /**
           * Defines whether an object should be displayed between this node and the following node.
           * <br>When set to <code>true</code>, a vertical red bar is displayed by default.
           * To define custom objects, use the <code>intermediary</code> aggregation.
           */
          showIntermediary: {
            type: 'boolean',
            group: 'Appearance',
            defaultValue: false
          },
          /**
           * Distance between this node and the following node.<br>When set to a percentage value,
           * the distance is calculated based on the height of the parent container.
           */
          stepWidth: {
            type: 'sap.ui.core.CSSSize',
            group: 'Appearance',
            defaultValue: null
          },
          /**
           * Defines whether a connector line should be displayed between this node and the node
           * that follows it.
           */
          showSeparator: {
            type: 'boolean',
            group: 'Appearance',
            defaultValue: true
          }
        },
        aggregations: {
          /**
           * Holds custom controls to be used as process flow nodes.
           */
          customControl: {
            type: 'sap.ui.core.Control',
            multiple: false,
            singularName: 'customControl'
          },
          /**
           * Holds objects to be displayed between the process flow nodes.
           */
          intermediary: {
            type: 'sap.ui.core.Control',
            multiple: false,
            singularName: 'intermediary'
          }
        },
        events: {
          /**
           * This event is fired when the user clicks or taps a node.
           */
          press: {
            parameters: {
              item: 'object'
            }
          }
        }
      },
      onAfterRendering: function() {
        this._setupEvents();
        this._setAccessibility();
      },
      renderer: function(oRM, oMicroProcessFlowItem) {
        var fnRenderSeparator = function() {
          // wrapper
          oRM.write('<div');
          oRM.writeAttributeEscaped('id', oMicroProcessFlowItem.getId() + '-separator');
          oRM.addClass('sapSuiteUiCommonsMicroProcessFlowItemSeparatorWrapper');
          oRM.writeClasses();
          oRM.addStyle('width', oMicroProcessFlowItem._getStepWidth());
          oRM.writeStyles();
          oRM.write('>');

          // separator
          oRM.write('<div ');
          oRM.addClass('sapSuiteUiCommonsMicroProcessFlowItemSeparator');
          // last item doesn't have visible separator, but can have intermediary
          if (!oMicroProcessFlowItem.getShowSeparator() || bIsLast) {
            oRM.addClass('sapSuiteUiCommonsMicroProcessFlowItemHiddenSeparator');
          }
          oRM.writeClasses();
          oRM.write('/>');

          if (bShowIntermediary) {
            fnRenderIntermediary();
          }

          oRM.write('</div>');
        };

        var fnRenderIntermediary = function() {
          var oIntermediary = oMicroProcessFlowItem.getIntermediary();

          oRM.write('<div class="sapSuiteUiCommonsMicroProcessFlowItemIntermediary" >');
          if (oIntermediary) {
            oRM.renderControl(oIntermediary);
          } else {
            oRM.write('<div class="sapSuiteUiCommonsMicroProcessFlowItemOnHoldElement" />');
          }
          oRM.write('</div>');
        };

        var sIcon = oMicroProcessFlowItem.getIcon() || oMicroProcessFlowItem._getIconByState(),
          bIsLast = oMicroProcessFlowItem.getParent()._isLastItem(oMicroProcessFlowItem),
          sId = oMicroProcessFlowItem.getId(),
          bShowIntermediary = oMicroProcessFlowItem.getShowIntermediary(),
          oCustomControl = oMicroProcessFlowItem.getCustomControl(),
          sTitle = oMicroProcessFlowItem.getTitle();

        oRM.write('<div ');
        oRM.addClass('sapSuiteUiCommonsMicroProcessFlowItemWrapper');
        oRM.writeClasses(oMicroProcessFlowItem);
        oRM.writeControlData(oMicroProcessFlowItem);
        oRM.write('>');

        oRM.write('<div');
        if (sTitle) {
          oRM.writeAttributeEscaped('title', sTitle);
        }
        oRM.writeAttributeEscaped('id', sId + '-item');
        oRM.writeAttribute('class', 'sapSuiteUiCommonsMicroProcessFlowItemContent');
        oRM.write('>');

        if (oCustomControl) {
          oRM.renderControl(oCustomControl);
        } else {
          oRM.write(
            '<div tabindex="0" id="' +
              sId +
              '-itemContent" class="sapSuiteUiCommonsMicroProcessFlowItem sapSuiteUiCommonsMicroProcessFlowItem' +
              oMicroProcessFlowItem.getState() +
              '"'
          );
          oRM.writeAttributeEscaped('aria-label', oMicroProcessFlowItem._getAriaText());
          oRM.write('>');

          if (sIcon) {
            oRM.renderControl(
              new sap.ui.core.Icon({
                tooltip: oMicroProcessFlowItem.getTitle(),
                src: sIcon
              }).addStyleClass('sapSuiteUiCommonsMicroProcessFlowItemIcon')
            );
          }
          oRM.write('</div>');
        }
        oRM.write('</div>');

        if (!bIsLast || bShowIntermediary) {
          fnRenderSeparator();
        }

        oRM.write('</div>');
      }
    });

    MicroProcessFlowItem.prototype.getFocusDomRef = function() {
      var oCustomControl = this.getCustomControl();

      return oCustomControl ? oCustomControl.getFocusDomRef() : this.getDomRef('itemContent');
    };

    /* =========================================================== */
    /* Private methods */
    /* =========================================================== */
    MicroProcessFlowItem.prototype._setAccessibility = function() {
      var $item = this._getAccessibleItem(),
        sAriaLabel = this._getAriaText();

      if ($item.attr('tabindex') !== '0') {
        $item.attr('tabindex', 0);
      }

      $item.attr('aria-label', sAriaLabel);
      $item.attr('aria-posinset', this._iIndex);
      $item.attr('aria-setsize', this._iItemsCount);
    };

    MicroProcessFlowItem.prototype._getAccessibleItem = function() {
      var $item = jQuery(this.getFocusDomRef());

      // if there is not tabindex for custom control
      // use our wrapper $item and set tab index to it
      return $item.attr('tabindex') === '0' ? $item : this.$('item');
    };

    MicroProcessFlowItem.prototype._setupEvents = function() {
      var $item = this.$('item'),
        bHasPressEvent = this.hasListeners('press');

      $item.on(
        'touchstart click',
        function() {
          this._click();
        }.bind(this)
      );

      if (bHasPressEvent) {
        $item.mousedown(function(oEvent) {
          jQuery(this).addClass('sapSuiteUiCommonsMicroProcessFlowItemPressed');
        });

        $item.mouseup(function(oEvent) {
          jQuery(this).removeClass('sapSuiteUiCommonsMicroProcessFlowItemPressed');
        });
      }

      if (bHasPressEvent) {
        $item.css('cursor', 'pointer');
        $item.attr('role', 'button');
      }
    };

    MicroProcessFlowItem.prototype._getAriaText = function() {
      var sText = oResourceBundle.getText('MICRO_PROCESS_FLOW_ITEM');

      switch (this.getState()) {
        case ValueState.Error:
          sText += ' - ' + oResourceBundle.getText('MICRO_PROCESS_FLOW_ERROR');
          break;

        case ValueState.Warning:
          sText += ' - ' + oResourceBundle.getText('MICRO_PROCESS_FLOW_WARNING');
          break;

        case ValueState.Success:
          sText += ' - ' + oResourceBundle.getText('MICRO_PROCESS_FLOW_SUCCESS');
          break;
      }

      if (this.getTitle()) {
        sText += ' - ' + this.getTitle();
      }

      return sText;
    };

    MicroProcessFlowItem.prototype._isCompact = function() {
      return (
        jQuery('body').hasClass('sapUiSizeCompact') ||
        this.$().is('.sapUiSizeCompact') ||
        this.$().closest('.sapUiSizeCompact').length > 0
      );
    };

    MicroProcessFlowItem.prototype._getStepWidth = function() {
      var oWidth = this.getStepWidth();

      if (!oWidth) {
        oWidth = this._isCompact() ? '1rem' : '1.5rem';
      }

      return oWidth;
    };

    MicroProcessFlowItem.prototype._setAccessibilityData = function(iIndex, iItemsCount) {
      this._iIndex = iIndex;
      this._iItemsCount = iItemsCount;
    };

    MicroProcessFlowItem.prototype._click = function() {
      var oParent = this.getParent();

      if (oParent) {
        oParent._bKeyBoard = false;
      }

      this._firePress();
    };

    MicroProcessFlowItem.prototype._firePress = function() {
      this.firePress({
        item: this.getFocusDomRef()
      });
    };

    MicroProcessFlowItem.prototype._getIconByState = function() {
      return DefaultIcons[this.getState()];
    };

    return MicroProcessFlowItem;
  },
  /* bExport= */ true
);
