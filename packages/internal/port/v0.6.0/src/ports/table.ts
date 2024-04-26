import { enums } from "../collections/enums";
import { getCustomEnumType, getEnumType, getType } from "../funcs/getType";
import { type NodePort } from "../../types";

const units = ["rem", "%", "px"];
const heightUnits = ["rem", "px"];

export default [
  // Enablers
  {
    name: "table2SingleSelection",
    group: "Enablers",
    type: getType("boolean", "editor"),
    displayName: "Single selection",
    default: false,
  },
  {
    name: "table2MultiSelection",
    group: "Enablers",
    type: getType("boolean", "editor"),
    displayName: "Multi selection",
    default: false,
  },
  {
    name: "table2Sort",
    group: "Enablers",
    type: getType("boolean", "editor"),
    displayName: "Sort",
    default: false,
  },
  {
    name: "table2FilterEnabled",
    group: "Enablers",
    type: getType("boolean", "editor"),
    displayName: "Filter",
    default: false,
  },
  {
    name: "table2Expansion",
    group: "Enablers",
    type: getType("boolean", "editor"),
    displayName: "Expansion",
    default: false,
  },
  {
    name: "table2Layout",
    group: "Enablers",
    type: getType("boolean", "editor"),
    displayName: "Layout",
    default: false,
  },
  {
    name: "table2Dimensions",
    group: "Enablers",
    type: getType("boolean", "editor"),
    displayName: "Dimensions",
    default: false,
  },
  {
    name: "table2TableStyles",
    group: "Enablers",
    type: getType("boolean", "editor"),
    displayName: "Table styles",
    default: false,
  },
  {
    name: "table2RowStyles",
    group: "Enablers",
    type: getType("boolean", "editor"),
    displayName: "Row styles",
    default: false,
  },
  // Params
  {
    name: "table2Columns",
    group: "Params",
    type: "array",
    displayName: "Columns",
  },
  {
    name: "table2OnRowClick",
    group: "Params",
    type: getCustomEnumType(["disabled", "singleSelection", "expansion"]),
    displayName: "On row click",
    default: "disabled",
    customs: { required: "both" },
  },
  {
    name: "table2TextSelection",
    group: "Params",
    type: "boolean",
    displayName: "Text selection",
    default: true,
  },
  {
    name: "table2ColumnIndex",
    group: "Params",
    type: "number",
    displayName: "Column index",
    customs: { required: "both" },
  },
  {
    name: "table2Controlled",
    group: "Params",
    type: "boolean",
    displayName: "Controlled",
    default: false,
  },
  // Data
  { name: "table2Items", group: "Data", type: "array", displayName: "Items" },
  { name: "tableId", group: "Data", type: "string", displayName: "tableId" }, // MD
  {
    name: "parentTableId",
    group: "Data",
    type: "string",
    displayName: "parentTableId",
  }, // MD
  // Single selection
  {
    name: "table2SingleSelectedItem",
    group: "Single selection",
    type: "object",
    displayName: "Single selected item",
    customs: {
      dependsOn(p) {
        return p.table2SingleSelection ? true : false;
      },
    },
  },
  {
    name: "table2Unselectable",
    group: "Single selection",
    type: "boolean",
    displayName: "Unselectable",
    default: false,
    customs: {
      dependsOn(p) {
        return p.table2SingleSelection ? true : false;
      },
    },
  },
  {
    name: "table2SingleSelected",
    group: "Single selection",
    type: "signal",
    displayName: "Single selected",
    customs: {
      dependsOn(p) {
        return p.table2SingleSelection ? true : false;
      },
    },
  },
  {
    name: "table2SingleUnselected",
    group: "Single selection",
    type: "signal",
    displayName: "Single unselected",
    customs: {
      dependsOn(p) {
        return p.table2SingleSelection && p.table2Unselectable;
      },
    },
  },
  {
    name: "table2ResetSingleSelection",
    group: "Single selection",
    type: "signal",
    displayName: "Reset single selection",
    customs: {
      dependsOn(p) {
        return p.table2SingleSelection ? true : false;
      },
    },
  },
  // Multi selection
  {
    name: "table2MultiSelectedItems",
    group: "Multi selection",
    type: "array",
    displayName: "Multi selected items",
    customs: {
      dependsOn(p) {
        return p.table2MultiSelection ? true : false;
      },
    },
  },
  {
    name: "table2MultiSelectionChanged",
    group: "Multi selection",
    type: "signal",
    displayName: "Multi selection changed",
    customs: {
      dependsOn(p) {
        return p.table2MultiSelection ? true : false;
      },
    },
  },
  {
    name: "table2ResetMultiSelection",
    group: "Multi selection",
    type: "signal",
    displayName: "Reset multi selection",
    customs: {
      dependsOn(p) {
        return p.table2MultiSelection ? true : false;
      },
    },
  },
  // Sort
  {
    name: "table2SortType",
    group: "Sort",
    type: getCustomEnumType(["frontend", "backend"]),
    displayName: "Type",
    default: "frontend",
    customs: {
      dependsOn(p) {
        return p.table2Sort ? true : false;
      },
    },
  },
  {
    name: "table2SortValue",
    group: "Sort",
    type: "array",
    displayName: "Sort value",
    customs: {
      dependsOn(p) {
        return p.table2Sort ? true : false;
      },
    },
  },
  {
    name: "table2ResetSort",
    group: "Sort",
    type: "signal",
    displayName: "Reset sort",
    customs: {
      dependsOn(p) {
        return p.table2Sort ? true : false;
      },
    },
  },
  {
    name: "table2SortedIcon",
    group: "Sort",
    type: "string",
    displayName: "Sorted icon",
    default: "IconArrowUp",
    customs: {
      dependsOn(p) {
        return p.table2Sort ? true : false;
      },
    },
  },
  {
    name: "table2UnsortedIcon",
    group: "Sort",
    type: "string",
    displayName: "Unsorted icon",
    default: "IconSelector",
    customs: {
      dependsOn(p) {
        return p.table2Sort ? true : false;
      },
    },
  },
  // Filter
  {
    name: "table2FilterType",
    group: "Filter",
    type: getCustomEnumType(["frontend", "backend"]),
    displayName: "Type",
    default: "frontend",
    customs: {
      dependsOn(p) {
        return p.table2FilterEnabled ? true : false;
      },
    },
  },
  {
    name: "table2FilterValue",
    group: "Filter",
    type: "*",
    displayName: "Filter value",
  },
  {
    name: "table2SetFilterValue",
    group: "Filter",
    type: "signal",
    displayName: "Set filter value",
  },
  {
    name: "table2Filter",
    group: "Filter",
    type: "signal",
    displayName: "Filter",
  },
  {
    name: "table2ResetFilters",
    group: "Filter",
    type: "signal",
    displayName: "Reset filters",
    customs: {
      dependsOn(p) {
        return p.table2FilterEnabled ? true : false;
      },
    },
  },
  // Expansion
  {
    name: "table2ExpandedItems",
    group: "Expansion",
    type: "array",
    displayName: "Expanded items",
    customs: {
      dependsOn(p) {
        return p.table2Expansion ? true : false;
      },
    },
  },
  {
    name: "table2AllowMultiple",
    group: "Expansion",
    type: "boolean",
    displayName: "Allow multiple",
    customs: {
      dependsOn(p) {
        return p.table2Expansion ? true : false;
      },
    },
  },
  {
    name: "table2ExpansionChanged",
    group: "Expansion",
    type: "signal",
    displayName: "Expansion changed",
    customs: {
      dependsOn(p) {
        return p.table2Expansion ? true : false;
      },
    },
  },
  {
    name: "table2ExpandAll",
    group: "Expansion",
    type: "signal",
    displayName: "Expand all",
    customs: {
      dependsOn(p) {
        return p.table2Expansion && p.table2AllowMultiple;
      },
    },
  },
  {
    name: "table2UnexpandAll",
    group: "Expansion",
    type: "signal",
    displayName: "Unexpand all",
    customs: {
      dependsOn(p) {
        return p.table2Expansion && p.table2AllowMultiple;
      },
    },
  },
  // Layout
  {
    name: "table2NoHeader",
    group: "Layout",
    type: "boolean",
    displayName: "No header",
    default: false,
    customs: {
      dependsOn(p) {
        return p.table2Layout ? true : false;
      },
    },
  },
  // Dimensions
  {
    name: "table2Width",
    group: "Dimensions",
    type: { name: "number", units, defaultUnit: "rem" },
    displayName: "Width",
    customs: {
      dependsOn(p) {
        return p.table2Dimensions ? true : false;
      },
    },
  },
  {
    name: "table2MinHeight",
    group: "Dimensions",
    type: { name: "number", units: heightUnits, defaultUnit: "px" },
    default: 84,
    displayName: "Min height",
    customs: {
      dependsOn(p) {
        return p.table2Dimensions ? true : false;
      },
    },
  },
  {
    name: "table2DynamicHeight",
    group: "Dimensions",
    type: "boolean",
    displayName: "Dynamic height",
    default: false,
    customs: {
      dependsOn(p) {
        return p.table2Dimensions ? true : false;
      },
    },
  },
  {
    name: "table2Height",
    group: "Dimensions",
    type: { name: "number", units: heightUnits, defaultUnit: "rem" },
    displayName: "Height",
    customs: {
      dependsOn(p) {
        return !p.table2DynamicHeight && p.table2Dimensions;
      },
    },
  },
  {
    name: "table2ViewportBOffset",
    group: "Dimensions",
    type: "number",
    displayName: "Viewport bottom offset",
    default: 0,
    customs: {
      dependsOn(p) {
        return p.table2DynamicHeight && p.table2Dimensions;
      },
    },
  },
  {
    name: "table2HorizontalSpacing",
    group: "Dimensions",
    type: getEnumType(enums.sizes),
    displayName: "Horizontal spacing",
    default: "sm",
    customs: {
      dependsOn(p) {
        return p.table2Dimensions ? true : false;
      },
    },
  },
  {
    name: "table2VerticalSpacing",
    group: "Dimensions",
    type: getEnumType(enums.sizes),
    displayName: "Vertical spacing",
    default: "xs",
    customs: {
      dependsOn(p) {
        return p.table2Dimensions ? true : false;
      },
    },
  },
  {
    name: "table2FontSize",
    group: "Dimensions",
    type: getEnumType(enums.sizes),
    displayName: "Font size",
    default: "sm",
    customs: {
      dependsOn(p) {
        return p.table2Dimensions ? true : false;
      },
    },
  },
  // Table styles
  {
    name: "table2Shadow",
    group: "Table styles",
    type: getEnumType(enums.sizes),
    displayName: "Shadow",
    default: "sm",
    customs: {
      dependsOn(p) {
        return p.table2TableStyles ? true : false;
      },
    },
  },
  {
    name: "table2WithBorder",
    group: "Table styles",
    type: "boolean",
    displayName: "With border",
    default: false,
    customs: {
      dependsOn(p) {
        return p.table2TableStyles ? true : false;
      },
    },
  },
  {
    name: "table2BorderRadius",
    group: "Table styles",
    type: getEnumType(enums.sizes),
    displayName: "Border radius",
    default: "md",
    customs: {
      dependsOn(p) {
        return p.table2TableStyles ? true : false;
      },
    },
  },
  {
    name: "table2ColumnBorders",
    group: "Table styles",
    type: "boolean",
    displayName: "Column borders",
    default: false,
    customs: {
      dependsOn(p) {
        return p.table2TableStyles ? true : false;
      },
    },
  },
  {
    name: "table2Animation",
    group: "Table styles",
    type: "boolean",
    displayName: "Animation",
    default: true,
    customs: {
      dependsOn(p) {
        return p.table2TableStyles && !p.table2Expansion;
      },
    },
  },
  {
    name: "table2LoaderColor",
    group: "Table styles",
    type: "string",
    displayName: "Loader color",
    customs: {
      dependsOn(p) {
        return p.table2TableStyles ? true : false;
      },
    },
  },
  // Row styles
  {
    name: "table2RowBorders",
    group: "Row styles",
    type: "boolean",
    displayName: "Row borders",
    default: true,
    customs: {
      dependsOn(p) {
        return p.table2RowStyles ? true : false;
      },
    },
  },
  {
    name: "table2Striped",
    group: "Row styles",
    type: "boolean",
    displayName: "Striped",
    default: false,
    customs: {
      dependsOn(p) {
        return p.table2RowStyles ? true : false;
      },
    },
  },
  {
    name: "table2OddBgColor",
    group: "Row styles",
    type: "string",
    displayName: "Odd bg color",
    customs: {
      dependsOn(p) {
        return p.table2RowStyles && p.table2Striped;
      },
    },
  },
  {
    name: "table2EvenBgColor",
    group: "Row styles",
    type: "string",
    displayName: "Even bg color",
    customs: {
      dependsOn(p) {
        return p.table2RowStyles && p.table2Striped;
      },
    },
  },
  {
    name: "table2RowBgColor",
    group: "Row styles",
    type: "string",
    displayName: "Bg color",
    customs: {
      dependsOn(p) {
        return p.table2RowStyles && p.table2Striped;
      },
    },
  },
  {
    name: "table2HighlightOnHover",
    group: "Row styles",
    type: "boolean",
    displayName: "Highlight on hover",
    default: false,
    customs: {
      dependsOn(p) {
        return p.table2RowStyles ? true : false;
      },
    },
  },
  {
    name: "table2OnHoverBgColor",
    group: "Row styles",
    type: "string",
    displayName: "On hover bg color",
    customs: {
      dependsOn(p) {
        return p.table2RowStyles && p.table2HighlightOnHover;
      },
    },
  },
  {
    name: "table2SingleSelectedRowBgColor",
    group: "Row styles",
    type: "string",
    displayName: "Single selection bg color",
    customs: {
      dependsOn(p) {
        return p.table2RowStyles && p.table2SingleSelection;
      },
    },
  },
  {
    name: "table2MutliSelectedRowBgColor",
    group: "Row styles",
    type: "string",
    displayName: "Mutli selection bg color",
    customs: {
      dependsOn(p) {
        return p.table2RowStyles && p.table2MultiSelection;
      },
    },
  },
  // States
  {
    name: "table2Fetching",
    group: "States",
    type: "boolean",
    displayName: "Fetching",
    default: true,
  },
] as const satisfies readonly NodePort[];
