import { ActionIcon, Group, Text, createStyles } from "@mantine/core"
import { Column } from "../types/Column"
import { TableCompProps } from "../types/TableCompProps"
import HeaderCheckbox from "./HeaderCheckbox"
import { Selection } from "../types/Selection"
import icons from "../../../../../../libs/icons/v0.2.0/icons"
import { MRT_TableInstance } from "mantine-react-table"

const IconChevronDown = icons('IconChevronDown')
const useStyles = createStyles(() => ({
    expandIcon: {
        transition: 'transform 0.15s ease',
    },
    expandIconRotated: {
        transform: 'rotate(0.5turn)',
    },
}))

export default function (props: { tableProps: TableCompProps, selectionProps: Selection, columnDef: Column, table: MRT_TableInstance<NItem> }) {
    const { table, tableProps } = props
    const { loading, expandAllAction, items, allSelect } = tableProps
    const { cx, classes } = useStyles()
    const hasData = items?.length > 0

    // margins
    let margins = {
        cell: 0,
        value: 0
    }
    if (!expandAllAction && !allSelect) margins.cell = 80
    if (expandAllAction && !allSelect) margins.value = 36
    if (!expandAllAction && allSelect) margins.cell = 44

    // all expanded state
    let allExpanded = false
    if (!loading) allExpanded = table.getExpandedRowModel().rows.length === Object.keys(table.getExpandedRowModel().rowsById).length

    return <Group ml={margins.cell} noWrap>
        {expandAllAction && <ActionIcon
            my={-4}
            variant='default'
            onClick={() => table.toggleAllRowsExpanded(!allExpanded)}
            disabled={!hasData}
        >
            <IconChevronDown
                size={16}
                className={cx(classes.expandIcon, { [classes.expandIconRotated]: allExpanded })}
            />
        </ActionIcon>}
        <HeaderCheckbox {...props} />
        <Text ml={margins.value}>{props.columnDef.header}</Text>
    </Group>
}