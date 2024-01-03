import { MantineColor, MantineNumberSize } from "@mantine/core"
import { DataTableProps } from "../lib"
import { ColumnDef200 } from "./Column"
import { RItem } from "@rk/types"
import { NoodlNode } from "@rk/node-fabrik"

export type TableProps200 = {
  libProps: DataTableProps<RItem>, children: any, columnsDef: ColumnDef200[], items: RItem[], fetching: boolean, allowMultiple: boolean
  // Params
  noodlNode: NoodlNode, onRowClick: 'disabled' | 'singleSelection' | 'expansion', customProps?: any
  // Selection
  selection: {
    single: { enabled: boolean, unselectable: boolean, selectedItem: RItem },
    multi: { enabled: boolean, selectedItems: RItem[] }
  }
  // Sort
  sort: { enabled: boolean, type: 'frontend' | 'backend', sortedIcon?: string, unsortedIcon?: string }
  // Filter
  filter: { enabled: boolean, type: 'frontend' | 'backend' }
  // Expansion
  expansion: { enabled: boolean, allowMultiple?: boolean, expandedItems?: RItem[] }
  // Dimensions
  dimensions: { width: MantineNumberSize, height: MantineNumberSize }
  // Table styles
  tableStyles: { animation: boolean }
  // Row styles
  rowStyles: {
    enabled: boolean, rowBorders: boolean, oddBgColor: MantineColor, evenBgColor: MantineColor, rowBgColor: MantineColor,
    onHoverBgColor: MantineColor, striped: boolean, singleSelectedRowBgColor: MantineColor, mutliSelectedRowBgColor: MantineColor,
  }
}