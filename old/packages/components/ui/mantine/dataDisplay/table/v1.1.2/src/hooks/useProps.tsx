import { Text } from '@mantine/core'
import deepEqual from 'fast-deep-equal'
import { deepMap } from 'nanostores'
import type { Props, TableProps } from '../../types'

const propsCache = deepMap<{ [noodlNodeId: string]: any }>({})

export default function (props: Props) {
	const nid = props.noodlNode.id
	const { table2Dimensions, table2TableStyles, table2RowStyles } = props

	// Params
	const params = {
		customProps: props.customProps,
		onRowClick: props.table2OnRowClick,
		columnsDef: props.table2Columns || [],
		items: props.table2Items || [],
	}
	// Selection
	const selection = {
		single: {
			enabled: props.table2SingleSelection,
			unselectable: props.table2Unselectable,
			selectedItem: props.table2SingleSelectedItem,
		},
		multi: { enabled: props.table2MultiSelection, selectedItems: props.table2MultiSelectedItems },
	}
	// Sort
	const sort = {
		enabled: props.table2Sort,
		type: props.table2SortType,
		sortedIcon: props.table2SortedIcon,
		unsortedIcon: props.table2UnsortedIcon,
	}
	// Filter
	const filter = { enabled: props.table2FilterEnabled, type: props.table2FilterType }
	// Expansion
	const expansion = {
		enabled: props.table2Expansion,
		allowMultiple: props.table2Expansion && props.table2AllowMultiple,
		expandedItems: props.table2Expansion && props.table2ExpandedItems,
	}
	// Dimensions
	const dimensions = {
		width: table2Dimensions ? props.table2Width : undefined,
		height: table2Dimensions && !props.table2DynamicHeight ? props.table2Height : undefined,
	}
	// Table styles
	const tableStyles = { animation: props.table2Expansion ? false : props.table2Animation }
	// Row styles
	const rowStyles = {
		enabled: props.table2RowStyles,
		rowBorders: props.table2RowBorders,
		oddBgColor: props.table2OddBgColor,
		evenBgColor: props.table2EvenBgColor,
		rowBgColor: props.table2RowBgColor,
		onHoverBgColor: props.table2OnHoverBgColor,
		striped: props.table2Striped,
		singleSelectedRowBgColor: props.table2SingleSelectedRowBgColor,
		mutliSelectedRowBgColor: props.table2MutliSelectedRowBgColor,
	}
	const libProps = {
		// Params
		textSelectionDisabled: !props.table2TextSelection,
		// Layout
		noHeader: props.table2Layout && props.table2NoHeader,
		// Dimensions
		minHeight: (table2Dimensions && props.table2MinHeight) || 84,
		height: table2Dimensions && !props.table2DynamicHeight ? props.table2Height : undefined,
		scrollAreaProps: {
			scrollAreaBottomOffset: (table2Dimensions && props.table2ViewportBOffset) || 0,
			...props.customProps?.scrollAreaProps,
		},
		horizontalSpacing: (table2Dimensions && props.table2HorizontalSpacing) || 'sm',
		verticalSpacing: (table2Dimensions && props.table2VerticalSpacing) || 'xs',
		fontSize: (table2Dimensions && props.table2FontSize) || 'sm',
		// Table styles
		shadow: (table2TableStyles && props.table2Shadow) || 'sm',
		withBorder: table2TableStyles && props.table2WithBorder,
		borderRadius: (table2TableStyles && props.table2BorderRadius) || 'md',
		withColumnBorders: table2TableStyles && props.table2ColumnBorders,
		emptyState: (
			<Text color="dimmed" size="sm">
				Записей не найдено
			</Text>
		),
		// Row styles
		striped: table2RowStyles && props.table2Striped,
		highlightOnHover: table2RowStyles && props.table2HighlightOnHover,
		// Loader styles
		loaderSize: props.customProps?.loader?.size || 'xl',
		loaderVariant: props.customProps?.loader?.variant || 'dots',
		loaderColor: props.table2LoaderColor,
		loaderBackgroundBlur: props.customProps?.loader?.bgBlur || 0.5,
		loaderBgColor: props.customProps?.loader?.bgColor || 'dark',
		loaderOpacity: props.customProps?.loader?.opacity || 0.1,
	}

	const newProps = {
		noodlNode: props.noodlNode,
		children: props.children,
		libProps,
		...params,
		selection,
		sort,
		filter,
		dimensions,
		tableStyles,
		rowStyles,
		fetching: props.table2Fetching,
		expansion,
	}
	const oldProps = propsCache.get()[nid]

	if (!deepEqual(oldProps, newProps)) {
		propsCache.setKey(nid, newProps)
		return newProps
	}
	return oldProps as TableProps
}
