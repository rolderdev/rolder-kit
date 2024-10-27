import type { CollapseProps, MantineColor, MantineShadow, MantineSize } from '@mantine/core'
import type { BaseReactProps, ReactNodeDef } from '@shared/node-v1.0.0'
import type { Item } from '@shared/types-v0.1.0'
import type { DataTableProps } from 'mantine-datatable'
import { lazy } from 'react'
import type { IconProps } from 'shared/src/icons'
import type { ColumnDefinition } from '../component/models/column'
import type { TableRecord } from '../component/models/record'
import type { MetaData } from '../component/shared/getRoodlReactNode'
import type { Store } from '../component/store'
import inputs from './inputs'
import outputs from './outputs'

export type { MetaData }

export type Props = BaseReactProps & {
	// Store
	store: Store
	// Base
	customProps?: {
		collapseProps?: CollapseProps
		// Multi selection
		allRecordsSelectionCheckboxProps?: DataTableProps<TableRecord>['allRecordsSelectionCheckboxProps']
		selectionCheckboxProps?: DataTableProps<TableRecord>['selectionCheckboxProps']
		getRecordSelectionCheckboxProps?: DataTableProps<TableRecord>['getRecordSelectionCheckboxProps']
		// Sort
		sortedIcon?: IconProps
		unsortedIcon?: IconProps
	}
	columnsDefinition?: ColumnDefinition[]
	items?: Item[]
	hierarchy: boolean
	rootNodeId?: string
	onRowClick: 'disabled' | 'signal' | 'singleSelection' | 'expansion'
	clickFilterFunc?: any
	textSelectionDisabled: boolean
	fetching: boolean

	// Layout
	noHeader: boolean

	// Dimensions
	minHeight?: string
	horizontalSpacing?: MantineSize
	verticalSpacing?: MantineSize | 'xxs'
	fz?: MantineSize

	// Table styles
	shadow?: MantineShadow
	withTableBorder?: boolean
	borderRadius?: MantineSize
	withColumnBorders?: boolean
	loaderColor?: MantineColor

	// Row styles
	rowStyles: boolean
	withRowBorders?: boolean
	striped?: boolean
	rowBackgroundColor?: MantineColor
	stripedColor?: MantineColor
	highlightOnHover?: boolean
	highlightOnHoverColor?: MantineColor
	singleSelectionRowBgColor?: MantineColor
	mutliSelectionRowBgColor?: MantineColor
	paddingLeftFunc?: any

	// Single selection
	defaultSelectedItem?: Item
	selectedItem?: Item
	singleSelectionFilterFunc?: any
	useSingleSelectionHierarchy?: boolean

	// Multi selection
	multiSelection: boolean
	useMultiSelectionHierarchy?: boolean
	defaultSelectedItems?: Item[]
	selectedItems?: Item[]
	multiSelectionFilterFunc?: any
	multiSelectionClasses?: string[]

	// Expansion
	expansion: boolean
	expansionTemplate: string
	allowMultiple?: boolean
	defaultExpandedItems?: Item[]
	expandedItems?: Item[]
	expansionFilterFunc?: any
	useExpansionHierarchy?: boolean
	animationChildrenCount?: number

	// Sort
	sort: boolean
	sortType: 'frontend' | 'backend'
	sortedIcon: string
	unsortedIcon: string
}

export default {
	hashTag: '#pre-release',
	module: { dynamic: lazy(() => import('../component/TableWrapper')) },
	inNode: {
		inputs,
		outputs,
	},
	afterNode: {
		getInspectInfo: (p: Props) => [
			{ type: 'text', value: '=== Columns ===' },
			{ type: 'value', value: p.columnsDefinition },
		],
	},
} satisfies ReactNodeDef
