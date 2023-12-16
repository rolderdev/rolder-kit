import { MRT_ColumnDef } from "mantine-react-table"

export interface Action {
    name: string
    type: 'ActionIcon'
    disabledSource?: string
    props?: any
}

export interface Column extends MRT_ColumnDef<NItem> {
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
    dataType?: 'date' | 'mask' | 'number'
    dateFormat?: string,
    maskFormat?: string,
    numberFormat?: { [key: string]: any }
    defaultValue?: any
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