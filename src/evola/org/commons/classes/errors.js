sap.ui.define(
  [
    'evola/org/commons/classes/errors/ClientError',
    'evola/org/commons/classes/errors/ServerError',
    'evola/org/commons/classes/errors/NoDataError'
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
