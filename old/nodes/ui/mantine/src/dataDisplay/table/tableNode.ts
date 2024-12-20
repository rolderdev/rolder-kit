import { reactNode } from '@packages/node'
import { getPort, getPorts, getType } from '@packages/port'
import { lazy } from 'react'
import ports200 from './ports/v2.0.0'

export default reactNode(
	'Table',
	{
		'v1.0.0': {
			hashTag: '#deprecated',
			module: { dynamic: lazy(() => import('@packages/table-v1.0.0')) },
			inputs: getPorts('input', [
				'customProps',
				'propsFunction',
				// Enablers
				'table2SingleSelection',
				'table2MultiSelection',
				'table2Sort',
				'table2FilterEnabled',
				'table2Expansion',
				'table2Layout',
				'table2Dimensions',
				'table2TableStyles',
				'table2RowStyles',
				// Params
				'table2Columns',
				'table2OnRowClick',
				'table2TextSelection',
				// Data
				'table2Items',
				// Single selection
				'table2SingleSelectedItem',
				'table2Unselectable',
				'table2ResetSingleSelection',
				// Multi selection
				'table2MultiSelectedItems',
				'table2ResetMultiSelection',
				// Sort
				'table2SortType',
				'table2SortedIcon',
				'table2UnsortedIcon',
				'table2ResetSort',
				// Filter
				'table2FilterType',
				'table2ResetFilters',
				// Expansion
				'table2ExpandedItems',
				'table2AllowMultiple',
				'table2ExpandAll',
				'table2UnexpandAll',
				// Layout
				'table2NoHeader',
				// Dimensions
				'table2Width',
				'table2MinHeight',
				'table2DynamicHeight',
				'table2ViewportBOffset',
				'table2Height',
				'table2HorizontalSpacing',
				'table2VerticalSpacing',
				'table2FontSize',
				// Table styles
				'table2Shadow',
				'table2WithBorder',
				'table2BorderRadius',
				'table2ColumnBorders',
				'table2Animation',
				'table2LoaderColor',
				// Row styles
				'table2RowBorders',
				'table2Striped',
				'table2OddBgColor',
				'table2EvenBgColor',
				'table2RowBgColor',
				'table2HighlightOnHover',
				'table2OnHoverBgColor',
				'table2SingleSelectedRowBgColor',
				'table2MutliSelectedRowBgColor',
				// States
				'table2Fetching',
			]),
			outputs: getPorts('output', [
				// Single selection
				'table2SingleSelectedItem',
				'table2SingleSelected',
				'table2SingleUnselected',
				// Multi selection
				'table2MultiSelectedItems',
				'table2MultiSelectionChanged',
				// Sort
				'table2SortValue',
				// Expansion
				'table2ExpandedItems',
				'table2ExpansionChanged',
			]),
		},
		'v1.1.0': {
			hashTag: '#deprecated',
			module: { dynamic: lazy(() => import('@packages/table-v1.1.0')) },
			inputs: getPorts('input', [
				'customProps',
				'propsFunction',
				// Enablers
				'table2SingleSelection',
				'table2MultiSelection',
				'table2Sort',
				'table2FilterEnabled',
				'table2Expansion',
				'table2Layout',
				'table2Dimensions',
				'table2TableStyles',
				'table2RowStyles',
				// Params
				'table2Columns',
				'table2OnRowClick',
				'table2TextSelection',
				// Data
				'table2Items',
				// Single selection
				'table2SingleSelectedItem',
				'table2Unselectable',
				'table2ResetSingleSelection',
				// Multi selection
				'table2MultiSelectedItems',
				'table2ResetMultiSelection',
				// Sort
				'table2SortType',
				'table2SortedIcon',
				'table2UnsortedIcon',
				'table2ResetSort',
				// Filter
				'table2FilterType',
				'table2ResetFilters',
				// Expansion
				'table2ExpandedItems',
				'table2AllowMultiple',
				'table2ExpandAll',
				'table2UnexpandAll',
				// Layout
				'table2NoHeader',
				// Dimensions
				'table2Width',
				'table2MinHeight',
				'table2DynamicHeight',
				'table2ViewportBOffset',
				'table2Height',
				'table2HorizontalSpacing',
				'table2VerticalSpacing',
				'table2FontSize',
				// Table styles
				'table2Shadow',
				'table2WithBorder',
				'table2BorderRadius',
				'table2ColumnBorders',
				'table2Animation',
				'table2LoaderColor',
				// Row styles
				'table2RowBorders',
				'table2Striped',
				'table2OddBgColor',
				'table2EvenBgColor',
				'table2RowBgColor',
				'table2HighlightOnHover',
				'table2OnHoverBgColor',
				'table2SingleSelectedRowBgColor',
				'table2MutliSelectedRowBgColor',
				// States
				'table2Fetching',
			]),
			outputs: getPorts('output', [
				// Single selection
				'table2SingleSelectedItem',
				'table2SingleSelected',
				'table2SingleUnselected',
				// Multi selection
				'table2MultiSelectedItems',
				'table2MultiSelectionChanged',
				// Sort
				'table2SortValue',
				// Expansion
				'table2ExpandedItems',
				'table2ExpansionChanged',
			]),
		},
		'v1.1.1': {
			hashTag: '#deprecated',
			module: { dynamic: lazy(() => import('@packages/table-v1.1.1')) },
			inputs: getPorts('input', [
				'customProps',
				'propsFunction',
				// Enablers
				'table2SingleSelection',
				'table2MultiSelection',
				'table2Sort',
				'table2FilterEnabled',
				'table2Expansion',
				'table2Layout',
				'table2Dimensions',
				'table2TableStyles',
				'table2RowStyles',
				// Params
				'table2Columns',
				'table2OnRowClick',
				'table2TextSelection',
				// Data
				'table2Items',
				// Single selection
				'table2SingleSelectedItem',
				'table2Unselectable',
				'table2ResetSingleSelection',
				// Multi selection
				'table2MultiSelectedItems',
				'table2ResetMultiSelection',
				// Sort
				'table2SortType',
				'table2SortedIcon',
				'table2UnsortedIcon',
				'table2ResetSort',
				// Filter
				'table2FilterType',
				'table2ResetFilters',
				// Expansion
				'table2ExpandedItems',
				'table2AllowMultiple',
				'table2ExpandAll',
				'table2UnexpandAll',
				// Layout
				'table2NoHeader',
				// Dimensions
				'table2Width',
				'table2MinHeight',
				'table2DynamicHeight',
				'table2ViewportBOffset',
				'table2Height',
				'table2HorizontalSpacing',
				'table2VerticalSpacing',
				'table2FontSize',
				// Table styles
				'table2Shadow',
				'table2WithBorder',
				'table2BorderRadius',
				'table2ColumnBorders',
				'table2Animation',
				'table2LoaderColor',
				// Row styles
				'table2RowBorders',
				'table2Striped',
				'table2OddBgColor',
				'table2EvenBgColor',
				'table2RowBgColor',
				'table2HighlightOnHover',
				'table2OnHoverBgColor',
				'table2SingleSelectedRowBgColor',
				'table2MutliSelectedRowBgColor',
				// States
				'table2Fetching',
			]),
			outputs: getPorts('output', [
				// Single selection
				'table2SingleSelectedItem',
				'table2SingleSelected',
				'table2SingleUnselected',
				// Multi selection
				'table2MultiSelectedItems',
				'table2MultiSelectionChanged',
				// Sort
				'table2SortValue',
				// Expansion
				'table2ExpandedItems',
				'table2ExpansionChanged',
			]),
		},
		'v1.1.2': {
			module: {
				dynamic: lazy(() => import('@packages/table-v1.1.2')),
			},
			inputs: getPorts('input', [
				'customProps',
				'propsFunction',
				// Enablers
				'table2SingleSelection',
				'table2MultiSelection',
				'table2Sort',
				'table2FilterEnabled',
				'table2Expansion',
				'table2Layout',
				'table2Dimensions',
				'table2TableStyles',
				'table2RowStyles',
				// Params
				'table2Columns',
				'table2OnRowClick',
				'table2TextSelection',
				// Data
				'table2Items',
				// Single selection
				'table2SingleSelectedItem',
				'table2Unselectable',
				'table2ResetSingleSelection',
				// Multi selection
				'table2MultiSelectedItems',
				'table2ResetMultiSelection',
				// Sort
				'table2SortType',
				'table2SortedIcon',
				'table2UnsortedIcon',
				'table2ResetSort',
				// Filter
				'table2FilterType',
				'table2ResetFilters',
				// Expansion
				'table2ExpandedItems',
				'table2AllowMultiple',
				'table2ExpandAll',
				'table2UnexpandAll',
				// Layout
				'table2NoHeader',
				// Dimensions
				'table2Width',
				'table2MinHeight',
				'table2DynamicHeight',
				'table2ViewportBOffset',
				'table2Height',
				'table2HorizontalSpacing',
				'table2VerticalSpacing',
				'table2FontSize',
				// Table styles
				'table2Shadow',
				'table2WithBorder',
				'table2BorderRadius',
				'table2ColumnBorders',
				'table2Animation',
				'table2LoaderColor',
				// Row styles
				'table2RowBorders',
				'table2Striped',
				'table2OddBgColor',
				'table2EvenBgColor',
				'table2RowBgColor',
				'table2HighlightOnHover',
				'table2OnHoverBgColor',
				'table2SingleSelectedRowBgColor',
				'table2MutliSelectedRowBgColor',
				// States
				'table2Fetching',
			]),
			outputs: getPorts('output', [
				// Single selection
				'table2SingleSelectedItem',
				'table2SingleSelected',
				'table2SingleUnselected',
				// Multi selection
				'table2MultiSelectedItems',
				'table2MultiSelectionChanged',
				// Sort
				'table2SortValue',
				// Expansion
				'table2ExpandedItems',
				'table2ExpansionChanged',
			]),
		},
		'v1.2.0': {
			hashTag: '#pre-release',
			module: {
				dynamic: lazy(() => import('@packages/table-v1.2.0')),
			},
			inputs: [
				...getPorts('input', [
					'customProps',
					'propsFunction',
					// Enablers
					'table2SingleSelection',
					'table2MultiSelection',
					'table2Sort',
					'table2FilterEnabled',
					'table2Expansion',
					'table2Layout',
					'table2Dimensions',
					'table2TableStyles',
					'table2RowStyles',
					// Params
					'table2Columns',
					'table2OnRowClick',
					'table2TextSelection',
					// Data
					'table2Items',
					// Single selection
					'table2SingleSelectedItem',
					'table2Unselectable',
					'table2ResetSingleSelection',
					// Multi selection
					'table2MultiSelectedItems',
					'table2ResetMultiSelection',
					// Sort
					'table2SortType',
					'table2SortedIcon',
					'table2UnsortedIcon',
					'table2ResetSort',
					// Filter
					'table2FilterType',
					'table2ResetFilters',
					// Expansion
					'table2ExpandedItems',
					'table2AllowMultiple',
					'table2ExpandAll',
					'table2UnexpandAll',
					// Layout
					'table2NoHeader',
					// Dimensions
					'table2Width',
					'table2MinHeight',
					'table2DynamicHeight',
					'table2ViewportBOffset',
					'table2Height',
					'table2HorizontalSpacing',
					'table2VerticalSpacing',
					'table2FontSize',
					// Table styles
					'table2Shadow',
					'table2WithBorder',
					'table2BorderRadius',
					'table2ColumnBorders',
					'table2Animation',
					'table2LoaderColor',
					// Row styles
					'table2RowBorders',
					'table2Striped',
					'table2OddBgColor',
					'table2EvenBgColor',
					'table2RowBgColor',
					'table2HighlightOnHover',
					'table2OnHoverBgColor',
					'table2SingleSelectedRowBgColor',
					'table2MutliSelectedRowBgColor',
					// States
					'table2Fetching',
				]),
				getPort({
					plug: 'input',
					name: 'dataFetchError',
					displayName: 'Data fetch error',
					group: 'States',
					default: false,
					type: getType('boolean', 'connection'),
				}),
			],
			outputs: getPorts('output', [
				// Single selection
				'table2SingleSelectedItem',
				'table2SingleSelected',
				'table2SingleUnselected',
				// Multi selection
				'table2MultiSelectedItems',
				'table2MultiSelectionChanged',
				// Sort
				'table2SortValue',
				// Expansion
				'table2ExpandedItems',
				'table2ExpansionChanged',
				// Table Id and parentTableId
				'tableId',
				'parentTableId',
			]),
		},
		'v1.2.1': {
			hashTag: '#pre-release',
			module: {
				dynamic: lazy(() => import('@packages/table-v1.2.1')),
			},
			inputs: [
				...getPorts('input', [
					'customProps',
					'propsFunction',
					// Enablers
					'table2SingleSelection',
					'table2MultiSelection',
					'table2Sort',
					'table2FilterEnabled',
					'table2Expansion',
					'table2Layout',
					'table2Dimensions',
					'table2TableStyles',
					'table2RowStyles',
					// Params
					'table2Columns',
					'table2OnRowClick',
					'table2TextSelection',
					// Data
					'table2Items',
					// Single selection
					'table2SingleSelectedItem',
					'table2Unselectable',
					'table2ResetSingleSelection',
					// Multi selection
					'table2MultiSelectedItems',
					'table2ResetMultiSelection',
					// Sort
					'table2SortType',
					'table2SortedIcon',
					'table2UnsortedIcon',
					'table2ResetSort',
					// Filter
					'table2FilterType',
					'table2ResetFilters',
					// Expansion
					'table2ExpandedItems',
					'table2AllowMultiple',
					'table2ExpandAll',
					'table2UnexpandAll',
					// Layout
					'table2NoHeader',
					// Dimensions
					'table2Width',
					'table2MinHeight',
					'table2DynamicHeight',
					'table2ViewportBOffset',
					'table2Height',
					'table2HorizontalSpacing',
					'table2VerticalSpacing',
					'table2FontSize',
					// Table styles
					'table2Shadow',
					'table2WithBorder',
					'table2BorderRadius',
					'table2ColumnBorders',
					'table2Animation',
					'table2LoaderColor',
					// Row styles
					'table2RowBorders',
					'table2Striped',
					'table2OddBgColor',
					'table2EvenBgColor',
					'table2RowBgColor',
					'table2HighlightOnHover',
					'table2OnHoverBgColor',
					'table2SingleSelectedRowBgColor',
					'table2MutliSelectedRowBgColor',
					// States
					'table2Fetching',
				]),
				getPort({
					plug: 'input',
					name: 'dataFetchError',
					displayName: 'Data fetch error',
					group: 'States',
					default: false,
					type: getType('boolean', 'connection'),
				}),
			],
			outputs: getPorts('output', [
				// Single selection
				'table2SingleSelectedItem',
				'table2SingleSelected',
				'table2SingleUnselected',
				// Multi selection
				'table2MultiSelectedItems',
				'table2MultiSelectionChanged',
				// Sort
				'table2SortValue',
				// Expansion
				'table2ExpandedItems',
				'table2ExpansionChanged',
				// Table Id and parentTableId
				'tableId',
				'parentTableId',
			]),
		},
		'v1.2.2': {
			hashTag: '#pre-release',
			module: {
				dynamic: lazy(() => import('@packages/table-v1.2.2')),
			},
			inputs: [
				...getPorts('input', [
					'customProps',
					'propsFunction',
					// Enablers
					'table2SingleSelection',
					'table2MultiSelection',
					'table2Sort',
					'table2FilterEnabled',
					'table2Expansion',
					'table2Layout',
					'table2Dimensions',
					'table2TableStyles',
					'table2RowStyles',
					// Params
					'table2Columns',
					'table2OnRowClick',
					'table2TextSelection',
					// Data
					'table2Items',
					// Single selection
					'table2SingleSelectedItem',
					'table2Unselectable',
					'table2ResetSingleSelection',
					// Multi selection
					'table2MultiSelectedItems',
					'table2ResetMultiSelection',
					// Sort
					'table2SortType',
					'table2SortedIcon',
					'table2UnsortedIcon',
					'table2ResetSort',
					// Filter
					'table2FilterType',
					'table2ResetFilters',
					// Expansion
					'table2ExpandedItems',
					'table2AllowMultiple',
					'table2ExpandAll',
					'table2UnexpandAll',
					// Layout
					'table2NoHeader',
					// Dimensions
					'table2Width',
					'table2MinHeight',
					'table2DynamicHeight',
					'table2ViewportBOffset',
					'table2Height',
					'table2HorizontalSpacing',
					'table2VerticalSpacing',
					'table2FontSize',
					// Table styles
					'table2Shadow',
					'table2WithBorder',
					'table2BorderRadius',
					'table2ColumnBorders',
					'table2Animation',
					'table2LoaderColor',
					// Row styles
					'table2RowBorders',
					'table2Striped',
					'table2OddBgColor',
					'table2EvenBgColor',
					'table2RowBgColor',
					'table2HighlightOnHover',
					'table2OnHoverBgColor',
					'table2SingleSelectedRowBgColor',
					'table2MutliSelectedRowBgColor',
					// States
					'table2Fetching',
				]),
				getPort({
					plug: 'input',
					name: 'dataFetchError',
					displayName: 'Data fetch error',
					group: 'States',
					default: false,
					type: getType('boolean', 'connection'),
				}),
			],
			outputs: getPorts('output', [
				// Single selection
				'table2SingleSelectedItem',
				'table2SingleSelected',
				'table2SingleUnselected',
				// Multi selection
				'table2MultiSelectedItems',
				'table2MultiSelectionChanged',
				// Sort
				'table2SortValue',
				// Expansion
				'table2ExpandedItems',
				'table2ExpansionChanged',
				// Table Id and parentTableId
				'tableId',
				'parentTableId',
			]),
		},
		'v1.2.3': {
			hashTag: '#pre-release',
			module: {
				dynamic: lazy(() => import('@packages/table-v1.2.3')),
			},
			inputs: [
				...getPorts('input', [
					'customProps',
					'propsFunction',
					// Enablers
					'table2SingleSelection',
					'table2MultiSelection',
					'table2Sort',
					'table2FilterEnabled',
					'table2Expansion',
					'table2Layout',
					'table2Dimensions',
					'table2TableStyles',
					'table2RowStyles',
					// Params
					'table2Columns',
					'table2OnRowClick',
					'table2TextSelection',
					// Data
					'table2Items',
					// Single selection
					'table2SingleSelectedItem',
					'table2Unselectable',
					'table2ResetSingleSelection',
					// Multi selection
					'table2MultiSelectedItems',
					'table2ResetMultiSelection',
					// Sort
					'table2SortType',
					'table2SortedIcon',
					'table2UnsortedIcon',
					'table2ResetSort',
					// Filter
					'table2FilterType',
					'table2ResetFilters',
					// Expansion
					'table2ExpandedItems',
					'table2AllowMultiple',
					'table2ExpandAll',
					'table2UnexpandAll',
					// Layout
					'table2NoHeader',
					// Dimensions
					'table2Width',
					'table2MinHeight',
					'table2DynamicHeight',
					'table2ViewportBOffset',
					'table2Height',
					'table2HorizontalSpacing',
					'table2VerticalSpacing',
					'table2FontSize',
					// Table styles
					'table2Shadow',
					'table2WithBorder',
					'table2BorderRadius',
					'table2ColumnBorders',
					'table2Animation',
					'table2LoaderColor',
					// Row styles
					'table2RowBorders',
					'table2Striped',
					'table2OddBgColor',
					'table2EvenBgColor',
					'table2RowBgColor',
					'table2HighlightOnHover',
					'table2OnHoverBgColor',
					'table2SingleSelectedRowBgColor',
					'table2MutliSelectedRowBgColor',
					// States
					'table2Fetching',
				]),
				getPort({
					plug: 'input',
					name: 'dataFetchError',
					displayName: 'Data fetch error',
					group: 'States',
					default: false,
					type: getType('boolean', 'connection'),
				}),
			],
			outputs: getPorts('output', [
				// Single selection
				'table2SingleSelectedItem',
				'table2SingleSelected',
				'table2SingleUnselected',
				// Multi selection
				'table2MultiSelectedItems',
				'table2MultiSelectionChanged',
				// Sort
				'table2SortValue',
				// Expansion
				'table2ExpandedItems',
				'table2ExpansionChanged',
				// Table Id and parentTableId
				'tableId',
				'parentTableId',
			]),
		},
		/* 'v2.0.0': {
			hashTag: '#expreimental',
			module: { dynamic: lazy(() => import('@packages/table-v2.0.0')) },
			inputs: ports200.inputs,
			outputs: ports200.outputs,
		}, */
	},
	{
		allowChildren: true,
		docs: 'https://docs.rolder.app/#/table',
	}
)
