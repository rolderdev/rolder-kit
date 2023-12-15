import { deepMap } from "nanostores"
import { TableCompProps200 } from "../types/TableCompProps"
import { Text } from "@mantine/core"
import { TableProps200 } from "../types/TableProps"

const propsCache = deepMap<{ [noodlNodeId: string]: any }>({})

export default function (props: TableCompProps200) {
    const { deepEqual } = window.R.libs
    const nid = props.noodlNode.id
    const { table2Dimensions, table2TableStyles, table2RowStyles } = props

    // Params    
    const params = {
        table2OnRowClick: props.table2OnRowClick, customProps: props.customProps, columnsDef: props.table2Columns, items: props.table2Items
    }
    // Selection
    const selection = {
        single: { enabled: props.table2SingleSelection, unselectable: props.table2Unselectable, selectedItem: props.table2SingleSelectedItem },
        multi: { enabled: props.table2MultiSelection, selectedItems: props.table2MultiSelectedItems }
    }
    // Sort
    const sort = { enabled: props.table2Sort, type: props.table2SortType, sortedIcon: props.table2SortedIcon, unsortedIcon: props.table2UnsortedIcon }
    // Expansion
    const allowMultiple = props.table2Expansion && props.table2AllowMultiple
    // Dimensions
    const dimensions = {
        width: table2Dimensions ? props.table2Width : undefined
    }
    const expandedItems = props.table2Expansion && props.table2ExpandedItems
    // Table styles
    const tableStyles = { animation: props.table2Animation }
    // Row styles
    const rowStyles = {
        enabled: props.table2RowStyles, rowBorders: props.table2RowBorders, oddBgColor: props.table2OddBgColor,
        evenBgColor: props.table2EvenBgColor, rowBgColor: props.table2RowBgColor, onHoverBgColor: props.table2OnHoverBgColor,
        striped: props.table2Striped, singleSelectedRowBgColor: props.table2SingleSelectedRowBgColor,
        mutliSelectedRowBgColor: props.table2MutliSelectedRowBgColor
    }
    const libProps = {
        // Params
        textSelectionDisabled: !props.table2TextSelection,
        // Layout
        noHeader: props.table2Layout && props.table2NoHeader,
        // Dimensions
        minHeight: (table2Dimensions && props.table2MinHeight) || 126,
        scrollAreaProps: {
            scrollAreaBottomOffset: (table2Dimensions && props.table2ViewportBOffset) || 0, ...props.customProps?.scrollAreaProps
        },
        horizontalSpacing: (table2Dimensions && props.table2HorizontalSpacing) || 'sm',
        verticalSpacing: (table2Dimensions && props.table2VerticalSpacing) || 'xs',
        fontSize: (table2Dimensions && props.table2FontSize) || 'sm',
        // Table styles
        shadow: (table2TableStyles && props.table2Shadow) || 'sm',
        withBorder: table2TableStyles && props.table2WithBorder,
        borderRadius: (table2TableStyles && props.table2BorderRadius) || 'md',
        withColumnBorders: table2TableStyles && props.table2ColumnBorders,
        emptyState: <Text color="dimmed" size="sm">Записей не найдено</Text>,
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
        noodlNode: props.noodlNode, children: props.children, libProps, ...params, selection, sort, dimensions, tableStyles, rowStyles,
        fetching: props.table2Fetching, expandedItems, allowMultiple
    } as TableProps200
    const oldProps = propsCache.get()[nid]

    if (!deepEqual(oldProps, newProps)) {
        propsCache.setKey(nid, newProps)
        return newProps
    } return oldProps as TableProps200
}