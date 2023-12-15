import { MantineColor, MantineNumberSize } from "@mantine/core"
import { DataTableProps } from "../lib"

export type TableProps200 = {
  libProps: DataTableProps<RItem>, children: any
  // Params
  noodlNode: NoodlNode, table2OnRowClick: 'disabled' | 'singleSelection' | 'expansion', customProps?: any
  // Selection
  selection: {
    single: { enabled: boolean, unselectable: boolean, selectedItem: RItem },
    multi: { enabled: boolean, selectedItems: RItem[] }
  }
  // Sort
  sort: { enabled: boolean, type: 'frontend' | 'backend', sortedIcon?: string, unsortedIcon?: string }
  // Dimensions
  dimensions: { width: MantineNumberSize }
  // Table styles
  tableStyles: { animation: boolean }
  // Row styles
  rowStyles: {
    enabled: boolean, rowBorders: boolean, oddBgColor: MantineColor, evenBgColor: MantineColor, rowBgColor: MantineColor,
    onHoverBgColor: MantineColor, striped: boolean, singleSelectedRowBgColor: MantineColor, mutliSelectedRowBgColor: MantineColor,
  }
}