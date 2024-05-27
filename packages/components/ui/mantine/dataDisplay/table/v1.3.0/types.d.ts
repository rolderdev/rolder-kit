import type { CollapseProps, MantineColor, MantineShadow, MantineSize } from '@mantine/core';
import { BaseReactProps } from '@packages/node';
import type { DataTableColumn, DataTableProps } from 'mantine-datatable';
import type { Item } from 'types';

export type Props = BaseReactProps & {
	// Base
	columnsDefinition?: ColumnDef[];
	items?: Item[];
	onRowClick?: 'disabled' | 'singleSelection' | 'expansion';
	onRowClickFunc?: any;

	// States
	fetching?: boolean;
	//dataFetchError?: boolean;

	// Layout
	noHeader: boolean;

	// Dimensions
	minHeight?: string;
	maxHeight?: string;
	horizontalSpacing?: MantineSize;
	verticalSpacing?: MantineSize;
	fz?: MantineSize;

	// Table styles
	shadow?: MantineShadow;
	withTableBorder?: boolean;
	borderRadius?: MantineSize;
	withColumnBorders?: boolean;
	loaderColor?: MantineColor;
	animation?: boolean;

	// Row styles
	rowStyles?: boolean;
	withRowBorders?: boolean;
	striped?: boolean;
	rowBackgroundColor?: MantineColor;
	stripedColor?: MantineColor;
	//oddBgColor?: MantineColor;
	//evenBgColor?: MantineColor;
	highlightOnHover?: boolean;
	highlightOnHoverColor?: MantineColor;
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
  table2FilterType: "frontend" | "backend";*/
};

export type TableProps = {
	// Base
	noodlNode: NoodlNode;
	customProps?: any;
	items: Item[];
	onRowClick: Props['onRowClick'];
	onRowClickFunc: any;
	libProps: DataTableProps<Item>;

	// Dimensions
	dimensions: {
		maxHeight: Props['maxHeight'];
	};

	// Table styles
	tableStyles: {
		animation: boolean;
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

export type ColumnDefinition = DataTableColumn<Item> & {
	getValue?(item: Item): any;
	template?: string;
	sort?: {
		default: 'asc' | 'desc';
		func?(items: Item[], direction: 'asc' | 'desc'): Item[];
	};
	filterFunc?(items: Item[], value: any): Item[];
	expander?: boolean;
	boxProps?: any;
};
