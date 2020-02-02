/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library evola.org.commons.
 */
sap.ui.define(
  ['sap/ui/core/library'], // library dependency
  function() {
    'use strict';

    /**
     *
     *
     * @namespace
     * @name evola.org.commons
     * @author SAP SE
     * @version 1.0.0
     * @public
     */

    // delegate further initialization of this library to the Core
    sap.ui.getCore().initLibrary({
      name: 'evola.org.commons',
      version: '1.0.0',
      dependencies: ["sap.ui.core", "sap.m"],
      types: ["evola.org.commons.MicroProcessFlowRenderType"],
      interfaces: [],
      controls: ['evola.org.commons.MicroProcessFlow', 'evola.org.commons.MicroProcessFlowItem'],
      elements: []
    });

    /**
     * Options that define how the micro process flow should be rendered inside its parent container.
     * <br>These options can be useful when the width of the parent container does not allow for
     * all nodes in the micro process flow to be displayed on the same line.
     *
     * @enum {string}
     * @public
     */
    evola.org.commons.MicroProcessFlowRenderType = {
      /**
       * The micro process flow nodes are wrapped inside the parent container.
       * @public
       */
      Wrap: "Wrap",

      /**
       * The micro process flow nodes are not wrapped inside the parent container.
       * <br>The nodes that do not fit into the width of the parent container are
       * not displayed.
       * @public
       */
      NoWrap: "NoWrap",

      /**
       * Two scrolling icons are added to the parent container, which allows navigation
       * by scrolling through the micro process flow.
       * <br>Please note that the numbers displayed next to the scrolling icons are not recalculated
       * dynamically when you resize the browser window. If you want them to be recalculated,
       * consider using the <code>ScrollingWithResizer</code> render type instead.
       * @public
       */
      Scrolling: "Scrolling",

      /**
       * Two scrolling icons are added to the parent container, with the number indicators
       * updated automatically when you resize the browser window.
       * <br>This option allows scrolling through the micro process flow, just as the <code>Scrolling</code>
       * option does, but may slightly affect the performance. If using this render type affects your
       * application's performance, consider using the <code>Scrolling</code> render type instead.
       * @public
       */
      ScrollingWithResizer: "ScrollingWithResizer"
    };

    /* eslint-disable */
    return evola.org.commons;
    /* eslint-enable */
  },
  /* bExport= */ false
);
