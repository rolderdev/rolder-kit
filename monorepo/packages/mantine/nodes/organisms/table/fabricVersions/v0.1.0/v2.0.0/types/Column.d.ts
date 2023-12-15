import { DataTableColumn } from "../lib"

export type ColumnDef200 = DataTableColumn<RItem> & {
    sort?: {
        default: 'asc' | 'desc'
        func?(items: RItem[], direction: 'asc' | 'desc'): RItem[]
    },
    filterFunc?(items: RItem[], value: any): RItem[]
}