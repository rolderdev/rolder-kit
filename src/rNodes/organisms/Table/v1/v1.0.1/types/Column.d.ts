import { MRT_ColumnDef } from "mantine-react-table"

export interface Action {
    name: string
    type: 'ActionIcon'
    disabledSource?: string
    props?: any
}

export interface Column extends MRT_ColumnDef<Item> {
    id: string
    accessor?: string
    groupShceme?: {
        groupBy: string
        accessor: string
        cellProps?: {
            multiselect?: boolean
            ml?: number
        }
    }[],
    dataType?: string
    dateFormat?: string,
    cellProps?: {
        ml?: number
    }
    filterProps?: {
        dateFormat: string
    }
    actions?: Action[]
}