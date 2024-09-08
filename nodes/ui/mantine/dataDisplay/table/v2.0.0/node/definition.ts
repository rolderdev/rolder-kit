import { lazy } from 'react';
import type { ReactNodeDef, BaseReactProps } from '@shared/node-v1.0.0';
import type { Item } from '@shared/types-v0.1.0';
import type { IconProps } from 'shared/src/icons';
import type { CollapseProps, MantineColor, MantineShadow, MantineSize } from '@mantine/core';
import type { DataTableProps } from 'mantine-datatable';
import type { Store } from './store';
import type { ColumnDefinition } from '../component/models/columnModel';
import type { TableRecord } from '../component/models/recordModel';
import type { MetaData } from '../component/funcs/getRoodlReactNode';
import inputs from './inputs';
import outputs from './outputs';
import getStore from './store';

export type { MetaData };

export type Props = BaseReactProps & {
	// Store
	store: Store;
	// Base
	customProps?: {
		collapseProps?: CollapseProps;
		// Multi selection
		allRecordsSelectionCheckboxProps?: DataTableProps<TableRecord>['allRecordsSelectionCheckboxProps'];
		selectionCheckboxProps?: DataTableProps<TableRecord>['selectionCheckboxProps'];
		getRecordSelectionCheckboxProps?: DataTableProps<TableRecord>['getRecordSelectionCheckboxProps'];
		// Sort
		sortedIcon?: IconProps;
		unsortedIcon?: IconProps;
	};
	columnsDefinition?: ColumnDefinition[];
	items?: Item[];
	hierarchy: boolean;
	rootNodeId?: string;
	onRowClick: 'disabled' | 'signal' | 'singleSelection' | 'expansion';
	clickFilterFunc?: any;
	textSelectionDisabled: boolean;

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

	// Row styles
	rowStyles: boolean;
	withRowBorders?: boolean;
	striped?: boolean;
	rowBackgroundColor?: MantineColor;
	stripedColor?: MantineColor;
	highlightOnHover?: boolean;
	highlightOnHoverColor?: MantineColor;
	singleSelectionRowBgColor?: MantineColor;
	mutliSelectionRowBgColor?: MantineColor;
	paddingLeftFunc?: any;

	// Single selection
	defaultSelectedItem?: Item;
	selectedItem?: Item;
	singleSelectionFilterFunc: any;

	// Multi selection
	multiSelection: boolean;
	useSelectionHierarchy?: boolean;
	defaultSelectedItems?: Item[];
	selectedItems?: Item[];
	multiSelectionFilterFunc?: any;

	// Expansion
	expansion: boolean;
	expansionTemplate: string;
	allowMultiple?: boolean;
	defaultExpandedItems?: Item[];
	expandedItems?: Item[];
	expansionFilterFunc?: any;
	animationChildrenCount?: number;

	// Sort
	sort: boolean;
	sortType: 'frontend' | 'backend';
	sortedIcon: string;
	unsortedIcon: string;

	/* 
  
  // Enablers    
  table2FilterEnabled: boolean;  
  
  // Params
  
    
  // Filter
  table2FilterType: "frontend" | "backend";*/
};

export default {
	hashTag: '#pre-release',
	module: { dynamic: lazy(() => import('../component/TableProvider')) },
	inputs,
	outputs,
	getInspectInfo: (p: Props) => [
		{ type: 'text', value: `=== Columns ===` },
		{ type: 'value', value: p.columnsDefinition },
	],
	initialize: async (p: Props, noodlNode) => {
		p.store = getStore(p, noodlNode);
	},
} satisfies ReactNodeDef;
