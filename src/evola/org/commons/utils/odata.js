sap.ui.define(['evola/org/commons/polyfills/Promise'], function() {
  'use strict';

  return {
    /**
     * Create entity or several entities
     * @param {String} sModelName - oData Model name
     * @param {String} sPath - A string containing the path to the data which should be updated
     * @param {Boolean} bSubmit=false - call submitChanges instead
     * @param {Object} oData - entity
     * @param {String} [groupId] - ID of a request group
     * @param {String} [changeSetId] - ID of the ChangeSet that this request should belong to
     * @returns {Promise} - Promise object
     */
    createEntity: function(sModelName, sPath, bSubmit, oData, groupId, changeSetId) {
      if (!sModelName) {
        return Promise.reject(new ClientError('Fill parameters!'));
      }
      var oModel = this.getModel(sModelName);
      if (!oModel) {
        return Promise.reject(new ClientError('Model not found'));
      }

      if (bSubmit) {
        return this.submitEntitiesChanges(sModelName, groupId);
      }

      if (!sPath) {
        return Promise.reject(new ClientError('Path not defined'));
      }
      if (sPath[0] !== '/') {
        sPath = '/' + sPath;
      }

      return new Promise(function(resolve, reject) {
        oModel.create(sPath, oData, {
          // groupId: groupId,
          changeSetId: changeSetId,
          success: function(result) {
            resolve(result && result.results ? result.results : result);
          },
          error: reject
        });
      });
    },

    /**
     * Update entity or several entities
     * @param {String} sModelName - oData Model name
     * @param {String} sPath - A string containing the path to the data which should be updated
     * @param {Boolean} bSubmit=false - call submitChanges instead
     * @param {Object} oData - entity
     * @param {String} [groupId] - ID of a request group
     * @param {String} [changeSetId] - ID of the ChangeSet that this request should belong to
     * @returns {Promise} - Promise object
     */
    updateEntity: function(sModelName, sPath, bSubmit, oData, groupId, changeSetId) {
      if (!sModelName) {
        return Promise.reject(new ClientError('Fill parameters!'));
      }
      var oModel = this.getModel(sModelName);
      if (!oModel) {
        return Promise.reject(new ClientError('Model not found'));
      }

      if (bSubmit) {
        return this.submitEntitiesChanges(sModelName, groupId);
      }

      if (!sPath) {
        return Promise.reject(new ClientError('Path not defined'));
      }
      if (sPath[0] !== '/') {
        sPath = '/' + sPath;
      }

      return new Promise(function(resolve, reject) {
        oModel.update(sPath, oData, {
          // groupId: groupId,
          changeSetId: changeSetId,
          success: function(result) {
            resolve(result && result.results ? result.results : result);
          },
          error: reject
        });
      });
    },

    /**
     * Delete entity
     * @param {String} sModelName - oData Model name
     * @param {String} sPath - A string containing the path to the data which should be deleted
     * @param {String} [groupId] - ID of a request group
     * @param {String} [changeSetId] - ID of the ChangeSet that this request should belong to
     * @return {Promise} - Promise pending instance
     */
    deleteEntity: function(sModelName, sPath, groupId, changeSetId) {
      if (!sModelName) {
        return Promise.reject(new ClientError('Fill parameters!'));
      }
      var oModel = this.getModel(sModelName);
      if (!oModel) {
        return Promise.reject(new ClientError('Model not found'));
      }

      if (!sPath) {
        return Promise.reject(new ClientError('Path not defined'));
      }
      if (sPath[0] !== '/') {
        sPath = '/' + sPath;
      }

      return new Promise(function(resolve, reject) {
        oModel.remove(sPath, {
          // groupId: groupId,
          changeSetId: changeSetId,
          success: function(result) {
            resolve(result && result.results ? result.results : result);
          },
          error: reject
        });
      });
    },

    /**
     * Submit Entities Changes
     * @param {String} sModelName - oData Model name
     * @param {String} groupId - ID of a request group
     * @return {Promise} - Promise pending instance
     */
    submitEntitiesChanges: function(sModelName, groupId) {
      if (!sModelName) {
        return Promise.reject(new ClientError('Fill parameters!'));
      }
      var oModel = this.getModel(sModelName);
      if (!oModel) {
        return Promise.reject(new ClientError('Model not found'));
      }

      return new Promise(function(resolve, reject) {
        oModel.submitChanges({
          groupId: groupId,
          success: resolve,
          error: reject
        });
      });
    },

    /**
     * Read oData data
     * @param {String} sModelName - oData Model name
     * @param {String} sPath - A string containing the path to the data which should be retrieved
     * @param {String} sParameters - A map containing the parameters that will be passed as query strings
     * @param {Array} aFilters - An array of filters to be included in the request UR
     * @param {String} [groupId] - ID of a request group
     * @return {Promise} - Promise pending instance
     */
    readData: function(sModelName, sPath, sParameters, aFilters, groupId) {
      if (!sModelName) {
        return Promise.reject(new ClientError('Fill parameters!'));
      }
      var oModel = this.getModel(sModelName);
      if (!oModel) {
        return Promise.reject(new ClientError('Model not found'));
      }

      if (!sPath) {
        return Promise.reject(new ClientError('Path not defined'));
      }

      if (sPath[0] !== '/') {
        sPath = '/' + sPath;
      }

      return new Promise(
        function(resolve, reject) {
          if (!sModelName) {
            reject('Model name is empty');
          }

          oModel.read(sPath, {
            urlParameters: sParameters,
            async: true,
            groupId: groupId,
            filters: aFilters,
            success: function(result) {
              resolve(result && result.results ? result.results : result);
            },
            error: reject
          });
        }.bind(this)
      );
    },

    /**
     * Call oData function by name
     * @param {String} sModelName - oData Model name
     * @param {String} fnName - name of Function
     * @param {Object} params - parameters witch passes to function
     * @param {String} [method='GET'] - method to call function
     * @param {Boolean} [bUseBatch=false] - Whether the requests should be encapsulated in a batch request
     * @return {Promise} - Promise pending instance
     */
    callFunction: function(sModelName, fnName, params, method, bUseBatch) {
      if (!method) {
        method = 'GET';
      }

      if (!sModelName) {
        return Promise.reject(new ClientError('Model name is empty'));
      }

      var oDataModel = this.getModel(sModelName);
      var originalUseBatch = oDataModel.bUseBatch;

      // for batch mode
      if (Array.isArray(params) && bUseBatch) {
        if (!params.length) {
          return Promise.reject(new ClientError('Nothing to batch!'));
        }
        var cBatchGroupId = General.uuidv4();

        oDataModel.setUseBatch(!!bUseBatch);
        var aPromises = [];
        params.forEach(function(oParams, key) {
          aPromises.push(
            new Promise(function(resolve, reject) {
              oDataModel.callFunction(fnName, {
                method: method,
                async: true,
                urlParameters: oParams,
                success: function(result) {
                  resolve(result && result.results ? result.results : result[fnName.replace('/', '')]);
                },
                error: reject,
                batchGroupId: cBatchGroupId, // deprecated in future
                groupId: cBatchGroupId,
                changeSetId: key
              });
            })
          );
        });

        return Promise.all(aPromises).then(function(values) {
          oDataModel.setUseBatch(originalUseBatch);
          return values;
        });
      } else {
        return new Promise(function(resolve, reject) {
          oDataModel.setUseBatch(!!bUseBatch);
          oDataModel.callFunction(fnName, {
            method: method,
            async: true,
            urlParameters: params,
            success: function(result) {
              oDataModel.setUseBatch(originalUseBatch);
              resolve(result && result.results ? result.results : result[fnName.replace('/', '')]);
            },
            error: reject
          });
        });
      }
    }
  };
});
