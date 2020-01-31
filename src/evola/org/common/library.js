/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library evola.org.common.
 */
sap.ui.define(
  ['sap/ui/core/library'], // library dependency
  function() {
    'use strict';

    /**
     *
     *
     * @namespace
     * @name evola.org.common
     * @author SAP SE
     * @version 1.0.0
     * @public
     */

    // delegate further initialization of this library to the Core
    sap.ui.getCore().initLibrary({
      name: 'evola.org.common',
      version: '1.0.0',
      dependencies: ['sap.ui.core'],
      types: [],
      interfaces: [],
      controls: [],
      elements: []
    });

    /* eslint-disable */
    return evola.org.common;
    /* eslint-enable */
  },
  /* bExport= */ false
);
