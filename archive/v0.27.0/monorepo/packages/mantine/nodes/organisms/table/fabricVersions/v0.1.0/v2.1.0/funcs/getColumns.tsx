import { TableProps200 } from "../types/TableProps";
import { ColumnDef200 } from "../types/Column";
import { deepMap } from "nanostores";
import { Dispatch, cloneElement } from "react";
import { filterFuncs, filterStates } from "./getRecords";
import { ActionIcon, Box, Group } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import useRowStyles from "../hooks/useRowStyles";

export const columnsCache = deepMap<{ [noodleNodeId: string]: any[] }>({})

export default function (
    noodlNode: NoodlNode, columnsDef: ColumnDef200[], sort: TableProps200['sort'], filter: TableProps200['filter'], children: any,
    setFilterValue: any, setFilterState: any, forceUpdate: any, rowStyles: TableProps200['rowStyles'],
    expansion: TableProps200['expansion'], expandedRecordIds: string[], setExpandedRecordIds: Dispatch<React.SetStateAction<string[]>>,
    onRowClick: TableProps200['onRowClick'], customProps: any
) {
    // ColumnFilter
    const columnFilters = Array.isArray(children)
        ? children.filter(i => i.props.noodlNode.model.type.split('.')[1] === 'ColumnFilter')
        : children?.props.noodlNode.model.type.split('.')[1] === 'ColumnFilter'
            ? [children]
            : null

    // ColumnCell
    const columnCells = Array.isArray(children)
        ? children.filter(i => i.props.noodlNode.model.type.split('.')[1] === 'ColumnCell')
        : children?.props.noodlNode.model.type.split('.')[1] === 'ColumnCell'
            ? [children]
            : []

    // Expander    
    const { classes, cx } = useRowStyles(rowStyles)
    function Chevron(recordId: string) {
        return <IconChevronRight
            size="1.2em"
            className={cx(classes.expandIcon, {
                [classes.expandIconRotated]: expandedRecordIds.includes(recordId),
            })}
            {...customProps?.expander?.chevronIcon}
        />
    }
    function Expander(recordId: string, cellChild: any) {
        return <Group spacing="xs" noWrap={true}>
            {onRowClick === 'expansion'
                ? Chevron(recordId)
                : <ActionIcon
                    my={-8}
                    onClick={(e) => {
                        e.stopPropagation()
                        setExpandedRecordIds(old => {
                            if (expansion.allowMultiple) {
                                if (old.includes(recordId)) return old.filter(i => i !== recordId)
                                else return [...old, recordId]
                            } else return old.includes(recordId) ? [] : [recordId]
                        })
                    }}
                    {...customProps?.expander?.actionIcon}
                >
                    {Chevron(recordId)}
                </ActionIcon>}
            {cellChild}
        </Group>
    }

    const columns = columnsDef.map((column, columnIdx) => {
        // Sort
        if (!sort.enabled) {
            delete column.sortable
            delete column.sort
        } else {
            if (sort.type === 'backend') delete column.sort?.func
            if (column.sort) column.sortable = true
        }

        // Filter
        if (!filter.enabled) {
            delete column.filter
            delete column.filterFunc
            delete column.filtering
        } else {
            if (filter.type === 'backend') {
                delete column.filterFunc
            }
            const columnFilter = columnFilters?.find(i => i.props.noodlNode.props.table2ColumnIndex === columnIdx)
            if (columnFilter) {
                if (filter.type === 'frontend') {
                    filterFuncs.setKey(`${noodlNode.id}.${columnIdx}`, column.filterFunc)
                    columnFilter.props.noodlNode.resultProps.setFilterValue = setFilterValue
                }
                columnFilter.props.noodlNode.resultProps.setFilterState = setFilterState
                columnFilter.props.noodlNode.resultProps.forceUpdate = forceUpdate
                column.filter = ({ close }: { close: () => void }) => {
                    columnFilter.props.noodlNode.resultProps.close = close
                    return columnFilter
                }
                column.filtering = filterStates.get()[noodlNode.id]?.[columnIdx]
            }
        }
        const customRender = column.render
        column.render = (record, idx) => {
            // ColumnCell
            const columnCell = columnCells?.find(i => i.props.noodlNode.props.table2ColumnIndex === columnIdx)
            if (columnCell) {
                columnCell.props.noodlNode.resultProps.record = record
                return expansion.enabled && column.expander
                    ? <Box {...column.boxProps}>{Expander(record.id, cloneElement(columnCell))}</Box>
                    : <Box {...column.boxProps}>{cloneElement(columnCell)}</Box>
            } else return expansion.enabled && column.expander
                ? <Box {...column.boxProps}>{Expander(record.id, customRender
                    ? customRender(record, idx)
                    : window.R.utils.getValue.v8(record, column.accessor))}</Box>
                : <Box {...column.boxProps}>{customRender
                    ? customRender(record, idx)
                    : window.R.utils.getValue.v8(record, column.accessor)}</Box>
        }

        return column
    })

    columnsCache.setKey(noodlNode.id, columns)
    return columns
}