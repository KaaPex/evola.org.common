sap.ui.define(
  ['evola/org/commons/polyfills/Promise', 'evola/org/commons/polyfills/Fetch'],
  function() {
    'use strict';

    function Report() {}

    /**
     * Check browser version
     * @return {boolean} - if this is IE11
     */
    Report.msieVersion = function() {
      var ua = navigator.userAgent;
      var msie = ua.indexOf('MSIE ');

      if (msie !== -1 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        // If Internet Explorer, return version number
        return true;
      }
      // If another browser, return 0
      return false;
    };

    /**
     * Get filename from response header
     * @param {Object} response - result of fetching
     * @return {string} - filename if exist
     */
    Report.getFileName = function(response) {
      var filename = '';
      var disposition = response.headers.get('content-disposition');
      if (disposition) {
        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        var matches = filenameRegex.exec(disposition);
        if (matches !== null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }
      return filename;
    };

    /**
     * Get file from server by URL
     * @param {String} token - Security token
     * @param {String} path - path where file is exist
     * @param {String} [sFileName] - filename to save
     * @param {String} [sMimeType] - file type descriptor
     * @return {Promise} - Promise pending instance
     * @private
     */
    Report._getFile = function(token, path, sFileName, sMimeType) {
      var filename = sFileName;
      var mimeType = sMimeType;

      return fetch(path, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/octet-stream',
          'x-csrf-token': token
        }
      })
        .then(
          function(response) {
            if (!response.ok) {
              throw new ServerError(response.status + ': ' + response.statusText);
            }

            filename = Report.getFileName(response) || filename;
            mimeType = response.headers.get('content-type') || mimeType;

            var length = response.headers.get('content-length');

            if (this.msieVersion()) {
              return response;
            } else {
              var reader = response.body.getReader();
              var stream = new ReadableStream({
                start: function(controller) {
                  // The following function handles each data chunk
                  function push() {
                    // "done" is a Boolean and value a "Uint8Array"
                    reader.read().then(function(oData) {
                      // Is there no more data to read?
                      if (oData.done) {
                        // Tell the browser that we have finished sending data
                        controller.close();
                        return;
                      }

                      // Get the data and send it to the browser via the controller
                      controller.enqueue(oData.value);
                      push();
                    });
                  }

                  push();
                }
              });

              return new Response(stream, {
                headers: {
                  'Content-Disposition': 'attachment;filename=' + filename,
                  'Content-Type': mimeType,
                  'Content-Length': length
                }
              });
            }
          }.bind(this)
        )
        .then(function(response) {
          return response.blob();
        })
        .then(function(blob) {
          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, filename);
            return null;
          } else {
            return URL.createObjectURL(blob);
          }
        })
        .then(function(url) {
          if (!url) {
            return;
          }

          var anchor = document.createElement('a');

          anchor.download = filename;
          anchor.href = url;
          anchor.dataset.downloadurl = [mimeType, anchor.download, anchor.href].join(':');
          document.body.appendChild(anchor);
          anchor.click();

          setTimeout(function() {
            document.body.removeChild(anchor);
            anchor.remove();
            // revoke URL
            URL.revokeObjectURL(url);
          }, 100);
        })
        .catch(function(error) {
          logger.debug(error.message);
        });
    };

    /**
     * Execute report fetching
     * @param {String} securityToken - token for fetching report
     * @param {String} sPath - path where file is
     * @return {Promise} - Promise pending instance
     */
    Report.invoke = function(securityToken, sPath) {
      return Report._getFile(securityToken, sPath);
    };

    return Report;
  }
);
