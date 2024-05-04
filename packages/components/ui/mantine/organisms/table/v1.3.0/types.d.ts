import {
  MantineColor,
  MantineNumberSize,
  MantineShadow,
  type CollapseProps,
} from "@mantine/core";
import { BaseReactProps } from "@packages/node";
import { Item } from "types";
import { DataTableColumn, DataTableProps } from "./src/lib";

export type Props = BaseReactProps & {
  // Params
  table2Columns?: ColumnDef[];
  table2OnRowClick: "disabled" | "singleSelection" | "expansion";
  // Data
  table2Items?: Item[];

  // Dimensions
  dimensions: boolean;
  minHeight?: string;
  maxHeight?: string;
  fitWidthContent: boolean;
  maxWidth?: string;
  /* table2HorizontalSpacing: MantineNumberSize;
  table2VerticalSpacing: MantineNumberSize;
  table2FontSize: MantineNumberSize; */

  // Expansion
  //table2ExpandedItems: Item[];
  //table2AllowMultiple: boolean;
  expansionTemplate: string;
  allowMultiple: boolean;

  /* 
  
  // Enablers
  table2SingleSelection: boolean;
  table2MultiSelection: boolean;
  table2Sort: boolean;
  table2FilterEnabled: boolean;  
  table2Layout: boolean;
  table2TableStyles: boolean;
  table2RowStyles: boolean;
  // Params
  
  table2OnRowClick: "disabled" | "singleSelection" | "expansion";
  table2TextSelection: boolean;
  // Data  
  tableId?: String; // MD
  parentTableId?: String; // MD
  // Single selection
  table2SingleSelectedItem: Item;
  table2Unselectable: boolean;
  // Multi selection
  table2MultiSelectedItems: Item[];
  // Sort
  table2SortType: "frontend" | "backend";
  table2SortedIcon?: string;
  table2UnsortedIcon?: string;
  // Filter
  table2FilterType: "frontend" | "backend";
  // Expansion
  table2ExpandedItems: Item[];  
  expansionTemplate: string;
  // Layout
  table2NoHeader: boolean;
  
  // Table styles
  table2Shadow: MantineShadow;
  table2WithBorder: boolean;
  table2BorderRadius: MantineNumberSize;
  table2ColumnBorders: boolean;
  table2Animation: boolean;
  table2LoaderColor: MantineColor;
  // Row styles
  table2RowBorders: boolean;
  table2Striped: boolean;
  table2OddBgColor: MantineColor;
  table2EvenBgColor: MantineColor;
  table2RowBgColor: MantineColor;
  table2HighlightOnHover: boolean;
  table2OnHoverBgColor: MantineColor;
  table2SingleSelectedRowBgColor: MantineColor;
  table2MutliSelectedRowBgColor: MantineColor;
  // States
  table2Fetching: boolean;
  dataFetchError?: boolean; */
};

export type TableProps = {
  libProps: DataTableProps<Item>;
  //children: any;
  columnsDef: ColumnDef[];
  items: Item[];

  // Params
  noodlNode: NoodlNode;
  onRowClick: "disabled" | "singleSelection" | "expansion";
  customProps?: any;

  expansion: {
    enabled: boolean;
    template: string;
    allowMultiple?: boolean;
    //expandedItems?: Item[];
    collapseProps: CollapseProps;
  };

  // Selection
  /* selection: {
    single: { enabled: boolean; unselectable: boolean; selectedItem: Item };
    multi: { enabled: boolean; selectedItems: Item[] };
  };
  // Sort
  sort: {
    enabled: boolean;
    type: "frontend" | "backend";
    sortedIcon?: string;
    unsortedIcon?: string;
  };
  // Filter
  filter: { enabled: boolean; type: "frontend" | "backend" };
 */

  // Table styles
  /*  tableStyles: { animation: boolean };
  // Row styles
  rowStyles: {
    enabled: boolean;
    rowBorders: boolean;
    oddBgColor: MantineColor;
    evenBgColor: MantineColor;
    rowBgColor: MantineColor;
    onHoverBgColor: MantineColor;
    striped: boolean;
    singleSelectedRowBgColor: MantineColor;
    mutliSelectedRowBgColor: MantineColor;
  };
  // States
  fetching: boolean; */
};

export type ColumnDef = DataTableColumn<Item> & {
  getValue?(item: Item): any;
  sort?: {
    default: "asc" | "desc";
    func?(items: Item[], direction: "asc" | "desc"): Item[];
  };
  filterFunc?(items: Item[], value: any): Item[];
  expander?: boolean;
  boxProps?: any;
};
