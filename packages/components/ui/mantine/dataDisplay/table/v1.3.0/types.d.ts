import { MantineColor, MantineNumberSize, MantineShadow, type CollapseProps } from '@mantine/core';
import { BaseReactProps } from '@packages/node';
import type { DataTableColumn, DataTableProps } from 'mantine-datatable';
import { Item } from 'types';

export type Props = BaseReactProps & {
	// Base
	columns?: ColumnDef[];
	onRowClick?: 'disabled' | 'singleSelection' | 'expansion';
	items?: Item[];

	// States
	fetching?: boolean;
	//dataFetchError?: boolean;

	// Dimensions
	minHeight?: string;
	maxHeight?: string;
	fitWidthContent?: boolean;
	maxWidth?: string;
	horizontalSpacing?: MantineNumberSize;
	verticalSpacing?: MantineNumberSize;
	fontSize?: MantineNumberSize;

	// Table styles
	shadow?: MantineShadow;
	withBorder?: boolean;
	borderRadius?: MantineNumberSize;
	columnBorders?: boolean;
	animation?: boolean;
	loaderColor?: MantineColor;

	// Row styles
	rowStyles?: boolean;
	rowBorders?: boolean;
	striped?: boolean;
	rowBgColor?: MantineColor;
	oddBgColor?: MantineColor;
	evenBgColor?: MantineColor;
	highlightOnHover?: boolean;
	onHoverBgColor?: MantineColor;
	/*

table2SingleSelectedRowBgColor: MantineColor;
table2MutliSelectedRowBgColor: MantineColor;*/

	// Expansion
	expansion?: boolean;
	expansionTemplate: string;
	allowMultiple?: boolean;
	expandedItems?: Item[];

	/* 
  
  // Enablers
  table2SingleSelection: boolean;
  table2MultiSelection: boolean;
  table2Sort: boolean;
  table2FilterEnabled: boolean;  
  table2Layout: boolean;
  table2TableStyles: boolean;
  
  // Params
  
  
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
  
  // Layout
  table2NoHeader: boolean;*/
};

export type TableProps = {
	// Base
	noodlNode: NoodlNode;
	customProps?: any;
	columnsDef: ColumnDef[];
	items: Item[];
	onRowClick: 'disabled' | 'singleSelection' | 'expansion';
	libProps: DataTableProps<Item>;

	//children: any;

	// Table styles
	tableStyles: {
		animation: boolean;
	};

	// Row styles
	rowStyles: {
		enabled: boolean;
		rowBorders: boolean;
		striped: boolean;
		rowBgColor: MantineColor;
		oddBgColor: MantineColor;
		evenBgColor: MantineColor;
		highlightOnHover: boolean;
		onHoverBgColor: MantineColor;

		//singleSelectedRowBgColor: MantineColor;
		//mutliSelectedRowBgColor: MantineColor;
	};

	// Expansion
	expansion: {
		enabled: boolean;
		template: string;
		allowMultiple: boolean;
		collapseProps: CollapseProps;
		expandedItems: Item[];
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
};

export type ColumnDef = DataTableColumn<Item> & {
	getValue?(item: Item): any;
	sort?: {
		default: 'asc' | 'desc';
		func?(items: Item[], direction: 'asc' | 'desc'): Item[];
	};
	filterFunc?(items: Item[], value: any): Item[];
	expander?: boolean;
	boxProps?: any;
};
