sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'evola/org/commons/utils/general',
    'evola/org/commons/utils/odata'
  ],
  function(Controller, JSONModel, Filter, FO, GeneralUtils, OData) {
    'use strict';

    // Constant for dialog initialisation
    var DIALOG_CONTROLLER_NAME = 'evola.org.commons.component.quickView.Employee';
    var DIALOG_FRAGMENT_NAME = 'evola.org.commons.component.quickView.Employee';

    var INIT_DATA = {};

    var logger = jQuery.sap.log.getLogger('EMPLOYEE_QUICK_VIEW', jQuery.sap.log.Level.DEBUG);
    var oResourceModel = new sap.ui.model.resource.ResourceModel({
        bundleName: 'evola.org.commons.messagebundle'
      });

    /**
     * Init callbacks for current dialog
     */
    var initDialogCallbacks = function() {
      logger.debug('initDialogCallbacks');
      if (!this._dialog) {
        return;
      }

      if (this._onOpenCallback) {
        this._dialog.attachAfterOpen(
          this._onOpenCallback.fnFunction,
          this._onOpenCallback.oListener || this
        );
      }

      if (this._onCloseCallback) {
        this._dialog.attachAfterClose(
          this._onCloseCallback.fnFunction,
          this._onCloseCallback.oListener || this
        );
      }

      // destroy after close
      if (this._allowToDestroy) {
        this._dialog.attachAfterClose(this.destroy, this);
      }
    };

    /**
     * Convert data from model or another object to local data
     * @param {object} oData - data object
     * @return {Object} - result
     */
    var mapDataToLocal = function(oData) {
      return null;
    };

    var mapLocalToData = function() {
      return null;
    };

    /**
     * TagList Catalog Dialog class
     * @constructor
     */
    var CustomDialog = Controller.extend(DIALOG_CONTROLLER_NAME, {
      metadata: {
        library: 'evola.org.commons'
      },

      /**
       * @constructor
       * @param {Object} oSettings - settings for init dialog
       * @return {CustomDialog} - class instance
       */
      constructor: function(oSettings) {
        logger.debug('constructor');
        Controller.call(this);

        if (!oSettings) {
          oSettings = {};
        }

        if (!oSettings.owner) {
          throw new Error('Owner is not defined');
        }

        if (!oSettings.modelName) {
          throw new Error('Model name is not defined');
        }

        if (!oSettings.pernr) {
          throw new Error('Emploee id is not defined');
        }
        // set parent
        this._owner = oSettings.owner;

        // init model
        this._modelName = oSettings.modelName;
        var oModel = this._owner.getModel(this.modelName);
        if (!oModel) {
          throw new Error('Unknown model: ' + this.modelName);
        }

        this._allowToDestroy = oSettings.allowToDestroy || false;
        this._sPath = oSettings.sPath;
        this._pernr = oSettings.pernr;
        this._data = mapDataToLocal.call(this, oSettings.data) || INIT_DATA;

        this._onOpenCallback =
          oSettings.onOpen && typeof oSettings.onOpen.fnFunction === 'function'
            ? oSettings.onOpen
            : null;
        this._onCloseCallback =
          oSettings.onClose && typeof oSettings.onClose.fnFunction === 'function'
            ? oSettings.onClose
            : null;

        this._model = new JSONModel({
          data: this.data
        });

        // create dialog from fragment
        this._objectId = GeneralUtils.uuidv4();
        this._dialogId = oSettings.owner
          ? oSettings.owner.oView.createId(this._objectId)
          : this._objectId;
        this._dialog = sap.ui.xmlfragment(this._dialogId, DIALOG_FRAGMENT_NAME, this);
        if (this._dialog.setBusyIndicatorDelay) {
          this._dialog.setBusyIndicatorDelay(0);
        }
        this._dialog.setModel(oResourceModel, 'i18n');

        this._owner.getView().addDependent(this._dialog);

        oModel.metadataLoaded().then(
          function() {
            this._dialog.setBusy(true);
            var sPath = oModel.createKey('/Employers', {
              pernr: this.pernr
            });
            OData.readData
              .call(this._owner, this.modelName, this.sPath ? this.sPath : sPath)
              .then(
                function(employee) {
                  this._dialog.setModel(new JSONModel(employee));
                }.bind(this)
              )
              .catch(function(error) {
                logger.error(error.message);
              })
              .finally(
                function() {
                  this._dialog.setBusy(false);
                }.bind(this)
              );
          }.bind(this)
        );

        initDialogCallbacks.call(this);

        return this;
      }
    });

    /**
     * Object string representation
     * @return {string} - object as string
     */
    CustomDialog.prototype.toString = function() {
      return this._objectId;
    };

    /**
     * @destructor
     */
    CustomDialog.prototype.destroy = function() {
      logger.debug('destroy ' + this);
      this._model = null;
      this._data = null;
      // destroy dialog
      this._dialog.destroy(true);
      this._dialog = null;

      this._onOpenCallback = null;
      this._onCloseCallback = null;
      this._onSaveCallback = null;
    };

    CustomDialog.prototype.onExit = function() {
      logger.debug('onExit');
      // destroy after exit
      if (this._allowToDestroy) {
        this.destroy();
      }
    };

    /**
     * Open dialog
     * @return {Promise|Function} - Promise pending instance or function
     */
    CustomDialog.prototype.openBy = function(oControl) {
      logger.debug('openBy');

      if (!oControl) {
        return;
      }

      try {
        if (GeneralUtils.isPromise()) {
          return new Promise(
            function(resolve) {
              this._dialog.attachAfterOpen(resolve, this);
              this._dialog.openBy(oControl);
            }.bind(this)
          );
        }
      } catch (e) {
        this._dialog.openBy(oControl);
        return GeneralUtils.then();
      }
    };

    /**
     * Close dialog
     * @return {Promise|Function} - Promise pending instance or function
     */
    CustomDialog.prototype.close = function() {
      logger.debug('close');

      if (this._onCloseCallback) {
        this._onCloseCallback.fnFunction.call(this._onCloseCallback.oListener || this, null);
      }

      try {
        if (GeneralUtils.isPromise()) {
          return Promise.resolve(null);
        }
      } catch (e) {}
      return GeneralUtils.then(null);
    };

    CustomDialog.prototype.showPopover = function(oEvent) {
      logger.debug('showPopover');
      var sText = oEvent.getSource().data('text');
      var oSource = oEvent.getParameter('oSource');

      new sap.m.Popover({
        showHeader: false,
        horizontalScrolling: false,
        verticalScrolling: false,
        content: [new sap.m.Text({ width: '14rem', text: sText })]
      })
        .addStyleClass('sapUiContentPadding')
        .openBy(oSource);
    };

    /**
     * Data class property
     */
    Object.defineProperty(CustomDialog.prototype, 'pernr', {
      set: function(value) {
        this._pernr = value;
      },
      get: function() {
        return this._pernr;
      }
    });

    /**
     * Data class property
     */
    Object.defineProperty(CustomDialog.prototype, 'modelName', {
      set: function(value) {
        this._modelName = value;
      },
      get: function() {
        return this._modelName;
      }
    });

    /**
     * Data class property
     */
    Object.defineProperty(CustomDialog.prototype, 'data', {
      set: function(value) {
        this._data = value;
      },
      get: function() {
        return this._data;
      }
    });

    return CustomDialog;
  }
);
