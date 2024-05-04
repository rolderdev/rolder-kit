import { type TypeName } from "../../types";
import getEnum from "./getEnum";

export type PortType = ExpandedType | TypeName;
export type ExpandedType = {
  name: string;
  allowEditOnly?: boolean;
  allowConnectionsOnly?: boolean;
  enums?: readonly { value: string; label: string }[];
  units?: string[];
  defaultUnit?: Units;
  codeeditor?: "plaintext" | "javascript" | "typescript" | "css" | "json";
};
type Units = "%" | "rem" | "px";
export const defaultUnits = ["%", "rem", "px"];
type Only = "editor" | "connection";

export function getType(type: TypeName, only: Only): ExpandedType {
  return {
    name: type,
    allowEditOnly: only === "editor",
    allowConnectionsOnly: only === "connection",
  };
}

export function getEnumType(enums: ExpandedType["enums"], only?: Only) {
  let expandedType: ExpandedType = { name: "enum", enums };
  if (only) {
    if (only === "editor") expandedType.allowEditOnly = true;
    else expandedType.allowConnectionsOnly = true;
  }
  return expandedType;
}

export function getCustomEnumType(
  values: string[],
  noCase?: boolean,
  only?: Only
) {
  let expandedType: ExpandedType = {
    name: "enum",
    enums: getEnum(values, noCase),
  };
  if (only) {
    if (only === "editor") expandedType.allowEditOnly = true;
    else expandedType.allowConnectionsOnly = true;
  }
  return expandedType;
}

export function getUnitType(units: string[], defaultUnit: Units, only?: Only) {
  let expandedType: ExpandedType = { name: "number", units, defaultUnit };
  if (only) {
    if (only === "editor") expandedType.allowEditOnly = true;
    else expandedType.allowConnectionsOnly = true;
  }
  return expandedType;
}
