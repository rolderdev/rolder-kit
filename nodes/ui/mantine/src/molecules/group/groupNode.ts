import { reactNode } from "@packages/node";
import {
  enums,
  getCustomEnumType,
  getEnumType,
  getPort,
  getPorts,
  inputGroups,
} from "@packages/port";

const positions = ["left", "center", "right", "apart"];

import v100 from "@packages/group-v1.0.0";

export default reactNode(
  "Group",
  {
    "v1.0.0": {
      module: { static: v100 },
      inputs: [
        ...inputGroups.Margins,
        ...inputGroups.Paddings,
        getPort({
          plug: "input",
          name: "groupPosition",
          displayName: "Position",
          group: "Layout",
          default: "left",
          type: getCustomEnumType(positions),
          customs: { required: "both" },
        }),
        getPort({
          plug: "input",
          name: "groupSpacing",
          displayName: "Spacing",
          group: "Layout",
          default: "md",
          type: getEnumType(enums.sizes),
          customs: { required: "both" },
        }),
        ...getPorts("input", [
          "customProps",
          "grow",
          "noWrap",
          "w",
          "h",
          "opacity",
        ]),
      ],
    },
  },
  { allowChildren: true }
);
