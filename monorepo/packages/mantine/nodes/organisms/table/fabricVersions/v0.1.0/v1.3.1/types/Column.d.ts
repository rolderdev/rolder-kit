import { ActionIconProps, InputBaseProps, MantineColor, Sx } from "@mantine/core"
import { DateInputProps } from "@mantine/dates"
import { TablerIconsProps } from "@tabler/icons-react"
import { MRT_ColumnDef } from "mantine-react-table"

export type DataDef = {
    type?: 'number' | 'date' | 'array' | 'mask'
    default?: string | number // default value if empty
    defaultAccessor: string // default accessor to check value for template variant
    numberFormat?: { thousandSeparated: boolean } // numbro format, default thousandSeparated: true
    dateFormat?: string // dayjs format 'YYYY-MM-DD', default from project settings
    arrayFormat?: { accessor: string, join?: string, sortFn: (arr: any[]) => any } // array, joing default ', '
    maskFormat?: string // mask pattern format, no default
    defaultSort?: 'asc' | 'desc' // enable default sort
}

export type CellDef = {
    trancate?: boolean // trancate to size of column    
    lineClamp?: number // trancate lines
    tooltip?: boolean //enable tooltip
    tooltipColor?: MantineColor // tooltip color for trancated format
    respectLineBreak?: boolean // wrap by new line - '\n'
    colorMap?: { // set color from value by map
        accessor: string,
        map: { [x: string]: MantineColor }
    }
    style?: any // any Sx style props
    align?: 'left' | 'center' | 'right'
}

export type HeaderDef = {
    align?: 'left' | 'center' | 'right'
}

export interface FilterDef {
    dateInputProps?: HTMLPropsRef<HTMLInputElement> & Partial<DateInputProps>
}

export interface IconProps extends TablerIconsProps { name: string }

export interface ActionDef {
    name: string
    type: 'ActionIcon'
    disabledSource?: string
    actionIconProps?: ActionIconProps
    iconProps?: IconProps
}

export interface GroupScheme extends ColumnDef {
    groupBy: string // path to data to group by
    accessor: string // path to data to show at grouped cell at first column
    multiSelectable?: boolean // show checkbox at grouped cell and enable selecting childs
    backgroundColor?: MantineColor
    expandedBackgroundColor?: MantineColor
}

export interface ColumnDef extends MRT_ColumnDef<RItem> {
    accessor: string // path to data
    data?: DataDef
    cell?: CellDef
    headerProps?: HeaderDef
    filter?: FilterDef
    actions?: ActionDef[] // cell actions
    actionsOnly?: boolean // show only actions and center them
    hoverableActions?: boolean
    groupScheme?: GroupScheme[]
    render?: {
        comp: 'Avatar',
        props: any
    }
}