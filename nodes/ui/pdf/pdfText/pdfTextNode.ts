import { reactNode } from "@packages/node";
import { getPort, getPorts } from "@packages/port";

import v100 from "@packages/pdf-text-v1.0.0";

export default reactNode("PdfText", {
  "v1.0.0": {
    module: { static: v100 },
    inputs: [
      ...getPorts("input", ["customProps"]),
      getPort({
        plug: "input",
        name: "text",
        displayName: "Text",
        group: "Data",
        type: "string",
      }),
      getPort({
        plug: "input",
        name: "wrap",
        displayName: "Wrap",
        group: "Params",
        type: "boolean",
        default: true,
        customs: { required: "connection" },
      }),
      getPort({
        plug: "input",
        name: "fixed",
        displayName: "Fixed",
        group: "Params",
        type: "boolean",
        default: false,
        customs: { required: "connection" },
      }),
    ],
  },
});
