import type { MantineColor, MantineNumberSize, MantineShadow } from '@mantine/core'
import type { BaseReactProps } from '@packages/node'
import type { Item } from 'types'
import type { DataTableColumn, DataTableProps } from './src/lib'

export type Props = BaseReactProps & {
	// Enablers
	table2SingleSelection: boolean
	table2MultiSelection: boolean
	table2Sort: boolean
	table2FilterEnabled: boolean
	table2Expansion: boolean
	table2Layout: boolean
	table2Dimensions: boolean
	table2TableStyles: boolean
	table2RowStyles: boolean
	// Params
	table2Columns?: ColumnDef[]
	table2OnRowClick: 'disabled' | 'singleSelection' | 'expansion'
	table2TextSelection: boolean
	// Data
	table2Items?: Item[]
	// Single selection
	table2SingleSelectedItem: Item
	table2Unselectable: boolean
	// Multi selection
	table2MultiSelectedItems: Item[]
	// Sort
	table2SortType: 'frontend' | 'backend'
	table2SortedIcon?: string
	table2UnsortedIcon?: string
	// Filter
	table2FilterType: 'frontend' | 'backend'
	// Expansion
	table2ExpandedItems: Item[]
	table2AllowMultiple: boolean
	// Layout
	table2NoHeader: boolean
	// Dimensions
	table2Width: MantineNumberSize
	table2MinHeight: MantineNumberSize
	table2DynamicHeight: boolean
	table2Height: MantineNumberSize
	table2ViewportBOffset: number
	table2HorizontalSpacing: MantineNumberSize
	table2VerticalSpacing: MantineNumberSize
	table2FontSize: MantineNumberSize
	// Table styles
	table2Shadow: MantineShadow
	table2WithBorder: boolean
	table2BorderRadius: MantineNumberSize
	table2ColumnBorders: boolean
	table2Animation: boolean
	table2LoaderColor: MantineColor
	// Row styles
	table2RowBorders: boolean
	table2Striped: boolean
	table2OddBgColor: MantineColor
	table2EvenBgColor: MantineColor
	table2RowBgColor: MantineColor
	table2HighlightOnHover: boolean
	table2OnHoverBgColor: MantineColor
	table2SingleSelectedRowBgColor: MantineColor
	table2MutliSelectedRowBgColor: MantineColor
	// States
	table2Fetching: boolean
}

export type TableProps = {
	libProps: DataTableProps<Item>
	children: any
	columnsDef: ColumnDef[]
	items: Item[]

	// Params
	noodlNode: NoodlNode
	onRowClick: 'disabled' | 'singleSelection' | 'expansion'
	customProps?: any
	// Selection
	selection: {
		single: { enabled: boolean; unselectable: boolean; selectedItem: Item }
		multi: { enabled: boolean; selectedItems: Item[] }
	}
	// Sort
	sort: { enabled: boolean; type: 'frontend' | 'backend'; sortedIcon?: string; unsortedIcon?: string }
	// Filter
	filter: { enabled: boolean; type: 'frontend' | 'backend' }
	// Expansion
	expansion: { enabled: boolean; allowMultiple?: boolean; expandedItems?: Item[] }
	// Dimensions
	dimensions: { width: MantineNumberSize; height: MantineNumberSize }
	// Table styles
	tableStyles: { animation: boolean }
	// Row styles
	rowStyles: {
		enabled: boolean
		rowBorders: boolean
		oddBgColor: MantineColor
		evenBgColor: MantineColor
		rowBgColor: MantineColor
		onHoverBgColor: MantineColor
		striped: boolean
		singleSelectedRowBgColor: MantineColor
		mutliSelectedRowBgColor: MantineColor
	}
	// States
	fetching: boolean
}

export type ColumnDef = DataTableColumn<Item> & {
	getValue?(item: Item): any
	sort?: {
		default: 'asc' | 'desc'
		func?(items: Item[], direction: 'asc' | 'desc'): Item[]
	}
	filterDefaultEnabled: boolean
	filterFunc?(items: Item[], value: any): Item[]
	expander?: boolean
	boxProps?: any
}
