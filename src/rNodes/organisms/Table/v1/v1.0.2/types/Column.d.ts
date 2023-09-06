import { MRT_ColumnDef } from "mantine-react-table"

export interface Action {
    name: string
    type: 'ActionIcon'
    disabledSource?: string
    props?: any
}

export interface Column extends MRT_ColumnDef<Item> {
    id: string
    accessor: string
    groupScheme?: {
        groupBy: string
        accessor: string
        multiselect?: boolean
        cellProps?: {
            [key: string]: any
        },
        actions?: Action[]
    }[],
    dataType?: 'date' | 'mask'
    dateFormat?: string,
    maskFormat?: string,
    cellProps?: {
        [key: string]: any
    },
    filterProps?: {
        dateFormat: string
    }
    actions?: Action[]
    wrap?: boolean
    mantineTableBodyCellProps?: any
}