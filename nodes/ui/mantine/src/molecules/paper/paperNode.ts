import { reactNode } from "@packages/node";
import { getPorts, inputGroups } from "@packages/port";

import v100 from "@packages/paper-v1.0.0";

export default reactNode(
  "Paper",
  {
    "v1.0.0": {
      module: { static: v100 },
      inputs: [
        ...inputGroups.Margins,
        ...inputGroups.Paddings,
        ...getPorts("input", [
          "customProps",
          "opacity",
          "shadow",
          "radius",
          "withBorder",
        ]),
      ],
    },
  },
  { allowChildren: true }
);
