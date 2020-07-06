sap.ui.define(
  ['sap/ui/richtexteditor/RichTextEditor'],
  function (RTE) {
    'use strict';

    /**
     * Describes the internal status of the editor component used inside the RichTextEditor control. Currently only
     * relevant for TinyMCE4
     *
     * @enum {string}
     * @private
     */
    var EditorStatus = {
      /**
       * Uses TinyMCE version 4 as editor
       * @private
       */
      Initial: 'Initial',
      Loading: 'Loading',
      Initializing: 'Initializing',
      Loaded: 'Loaded',
      Ready: 'Ready',
      Destroyed: 'Destroyed',
    };

    /**
     * Check browser version
     * @return {boolean} - if this is IE11
     */
    var msieVersion = function () {
      var ua = navigator.userAgent;
      var msie = ua.indexOf('MSIE ');

      if (msie !== -1 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        // If Internet Explorer, return version number
        return true;
      }
      // If another browser, return 0
      return false;
    };

    var filePickerCallback = function (callback, value, meta) {
      var input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');

      input.onchange = function () {
        var file = this.files[0];

        var reader = new FileReader();
        reader.onload = function () {
          /*
            Note: Now we need to register the blob in TinyMCEs image blob
            registry. In the next release this part hopefully won't be
            necessary, as we are looking to handle it internally.
          */
          var id = 'blobid' + new Date().getTime();
          var blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
          var base64 = reader.result.split(',')[1];
          var blobInfo = blobCache.create(id, file, base64);
          blobCache.add(blobInfo);

          /* call the callback and populate the Title field with the file name */
          callback(blobInfo.blobUri(), { title: file.name });
        };
        reader.readAsDataURL(file);
      };

      if (msieVersion()) {
        document.body.appendChild(input);
        setTimeout(function () {
          document.body.removeChild(input);
          input.remove();
        }, 100);
      }

      input.click();
    };

    var CustomRte = RTE.extend('evola.org.commons.RichTextEditor', {
      metadata: {
        library: 'evola.org.commons',
        properties: {
          /**
           * Determines whether the <code>Container</code> is enabled (default is set to <code>true</code>).
           * A disabled <code>Container</code> has different colors maybe.
           */
          customImageUploader: {
            type: 'boolean',
            group: 'Behavior',
            defaultValue: false,
          },
        },
        events: {
          filePicker: {},
          imagesUpload: {},
        },
      },
      /**
       * @constructor
       * @return {CustomDialog} - class instance
       */
      constructor: function (sId, mSettings, oScope) {
        if (typeof sId !== 'string' && sId !== undefined) {
          // shift arguments in case sId was missing, but mSettings was given
          oScope = mSettings;
          mSettings = sId;
          sId = mSettings && mSettings.id;
        }
        // add custom image upload button
        if (this.getCustomImageUploader) {
          this._oResourceBundle = sap.ui
            .getCore()
            .getLibraryResourceBundle('sap.ui.richtexteditor');

          var imageButton = new sap.m.Button({
            icon: 'sap-icon://picture',
            type: 'Transparent',
            text: sap.ui.Device.system.desktop
              ? ''
              : this._oResourceBundle.getText(
                  sap.ui.richtexteditor.EditorCommands['InsertImage'].bundleKey
                ),
            tooltip: this._oResourceBundle.getText(
              sap.ui.richtexteditor.EditorCommands['InsertImage'].bundleKey
            ),
            press: function () {
              this.getNativeApi().execCommand('mceImage');
            }.bind(this),
          });

          if (mSettings.customButtons && Array.isArray(mSettings.customButtons)) {
            mSettings.customButtons.unshift(imageButton);
          } else {
            mSettings.customButtons = [imageButton];
          }
        }

        RTE.call(this, sId, mSettings, oScope);
      },
    });

    CustomRte.prototype._initializeTinyMCE4 = function () {
      this._pTinyMCE4Initialized = new Promise(
        function (fnResolve, fnReject) {
          this._bInitializationPending = false;
          this._tinyMCE4Status = EditorStatus.Initializing;
          this._textAreaDom.value = this._patchTinyMCE4Value(this.getValue());

          var config = this._createConfigTinyMCE4(
            function () {
              this._tinyMCE4Status = EditorStatus.Ready;
              // Wee need to add a timeout here, as the promise resolves before other asynchronous tasks like the
              // load-events, which leads to TinyMCE4 still trying to operate on its DOM after the promise is resolved.
              setTimeout(
                function () {
                  if (!this._bInitializationPending) {
                    this._onAfterReadyTinyMCE4();
                  }
                  fnResolve();
                }.bind(this),
                0
              );
            }.bind(this)
          );
          if (this.getCustomImageUploader) {
            Object.assignIn(config, {
              image_advtab: false,
              image_title: false,
              image_description: true,
              image_dimensions: true,
              image_uploadtab: false,
              plugins: config.plugins ? config.plugins.concat(',image') : 'image',
              file_picker_types: 'image',
            });
            // config.file_browser_callback = filePickerCallback;
            config.file_picker_callback = filePickerCallback;

            /* we override default upload handler to simulate successful upload*/
            config.images_upload_handler = function (blobInfo, success, failure) {
              this.fireImagesUpload({
                blob: blobInfo,
                success: success,
                failure: failure,
              });
            }.bind(this);
          }
          window.tinymce.init(config);
        }.bind(this)
      );
    };

    return CustomRte;
  },
  true
);
