import type { CollapseProps, LoaderProps, MantineColor, MantineShadow, MantineSize } from '@mantine/core';
import type { BaseReactProps, NoodlNode } from '@packages/node';
import type { DataTableColumn, DataTableProps } from 'mantine-datatable';
import type { Column } from './src/models/columnModel.tsx';
import type { IconProps } from '@tabler/icons-react';

export type Props = BaseReactProps & {
	// Base
	customProps?: {
		lib: DataTableProps;
		collapse: CollapseProps;
		// Multi selection
		selectionCheckboxProps: DataTableProps['selectionCheckboxProps'];
		getRecordSelectionCheckboxProps: DataTableProps['getRecordSelectionCheckboxProps'];
		selectionColumnStyle: DataTableProps['selectionColumnStyle'];
		isRecordSelectable: DataTableProps['isRecordSelectable'];
		// Sort
		sortedIcon: IconProps;
		unsortedIcon: IconProps;
	};
	columnsDefinition?: Column[];
	items?: Item[];
	onRowClick: 'disabled' | 'signal' | 'function' | 'singleSelection' | 'expansion';
	onRowClickFunc?: any;
	isParentTable?: boolean;
	renderDelay?: number;
	textSelectionDisabled?: boolean;

	// States
	//	fetching?: boolean;
	//dataFetchError?: boolean;

	// Layout
	noHeader: boolean;

	// Dimensions
	minHeight?: string;
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
	highlightOnHover?: boolean;
	highlightOnHoverColor?: MantineColor;
	singleSelectionRowBgColor?: MantineColor;
	mutliSelectionRowBgColor?: MantineColor;

	// Single selection
	singleSelection?: boolean;
	unselectable?: boolean;
	selectedItem?: Item;

	// Multi selection
	multiSelection?: boolean;
	selectionTrigger?: DataTableProps<Item>['selectionTrigger'];
	selectedItems?: Item[];

	// Expansion
	expansion?: boolean;
	expansionTemplate: string;
	allowMultiple?: boolean;
	expandedItems?: Item[];

	// Sort
	sort: boolean;
	sortType: 'frontend' | 'backend';
	sortedIcon: string;
	unsortedIcon: string;

	/* 
  
  // Enablers    
  table2FilterEnabled: boolean;  
  
  // Params
  
  
  table2TextSelection: boolean;
  // Data  
  tableId?: String; // MD
  parentTableId?: String; // MD
  
  
  // Filter
  table2FilterType: "frontend" | "backend";*/
};

/* export type Store = {
	noodlNode: NoodlNode;
	tableId: string;
	ready: boolean;
	libProps: LibProps;
	tableProps: TableProps;
	columns: Column[];
	records: Map<string, Record>;
	//templateCells: Map<string, Map<number, React.ReactNode>>;
}; */

/* export type State = {
	noodlNode: NoodlNode;
	tableId: string;
	customProps?: any;

	libState: {
		fetching: boolean;
		columns: ColumnDefinition[];
		records: Item[];
	};
	setLibState: (columns: ColumnDefinition[], items: Item[]) => void;

	props: {
		lib: LibProps;
		table: TableProps;
	};
	setProps: (newLibProps: LibProps, newTableProps: TableProps) => void; */

/* 	// Table styles
	tableStyles: {
		animation: boolean;
	};

	// Row styles
	rowStyles: {
		rowBackgroundColor: MantineColor;
		singleSelectionRowBgColor: MantineColor;
		mutliSelectionRowBgColor: MantineColor;
	};
 */
// Единичный выбор
/* selection: {
		single: { enabled: boolean; unselectable: boolean; selectedItem?: Item };
		multi: { enabled: boolean; selectedItems: Item[] };
	}; */

// Sort
/*sort: {
    enabled: boolean;
    type: "frontend" | "backend";
    sortedIcon?: string;
    unsortedIcon?: string;
  };
  // Filter
  filter: { enabled: boolean; type: "frontend" | "backend" };
 */
//};

/* export type TableProps = {
	onRowClick: Props['onRowClick'];
	//onRowClickFunc?: (item: Item, items: Item[]) => void;
	expansion: {
		enabled: boolean;
		template: string;
		allowMultiple: boolean;
		collapseProps: CollapseProps;
	};
}; */

/* export type ColumnDefinition = DataTableColumn<Item> & {
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
 */
