sap.ui.define(
  [
    'evola/org/common/classes/errors/ClientError',
    'evola/org/common/classes/errors/ServerError',
    'evola/org/common/classes/errors/NoDataError'
  ],
  function(ClientError, ServerError, NoDataError) {
    'use strict';
    return {
      ClientError: ClientError,
      ServerError: ServerError,
      NoDataError: NoDataError
    };
  }
);
