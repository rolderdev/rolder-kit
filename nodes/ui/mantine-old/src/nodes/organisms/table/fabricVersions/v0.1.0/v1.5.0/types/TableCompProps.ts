import { MRT_DensityState } from "mantine-react-table"
import { DefaultMantineColor, MantineNumberSize, MantineShadow } from "@mantine/core"
import { ColumnDef } from "./Column"

export type TableCompProps = {
  noodlNode: NoodlNode
  // params, data
  tableVariant: 'basic' | 'grouped', columns: ColumnDef[], selectable: boolean, items: RItem[], hideHeaders: boolean
  // states
  tableLoading: boolean, tableRefreshing: boolean
  // layout
  disableHeader: boolean, stickyHeader: boolean, tableDensity: MRT_DensityState,
  // dimensions
  tableWidth: string, defaultColumnSize: number, dynamicHeight: boolean, tableMaxHeight: string, tableViewportBOffset: string,
  tableLoaderSize: MantineNumberSize
  // table style  
  tableRadius: MantineNumberSize, tableShadow: MantineShadow, tableWithBorder: boolean, withColumnBorders: boolean,
  tableLoaderColor: DefaultMantineColor,
  // row style
  rowsWithBorder: boolean, rowBackgroundColor: string, highlightOnHover: boolean, onHoverColor: string, highlightSelectedRow: boolean,
  selectedRowColor: string, multiSelectCheckboxColor: string, highlightSelectedGroupedRow: boolean, selectedGroupedRowColor: string
  // selectable
  singleSelectable: boolean, singleUnselectable: boolean, multiSelectable: boolean, allSelectable: boolean,
  groupedRowSelectable: boolean, groupedRowUnselectable: boolean

  //// grouped
  // params
  expandOn: 'row' | 'icon', expandAllAction: boolean
}