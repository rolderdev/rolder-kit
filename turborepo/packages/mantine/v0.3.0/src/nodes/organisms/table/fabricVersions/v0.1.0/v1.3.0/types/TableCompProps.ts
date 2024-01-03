import { MRT_DensityState } from "mantine-react-table"
import { DefaultMantineColor, MantineNumberSize, MantineShadow } from "@mantine/core"
import { ColumnDef } from "./Column"
import { NoodlNode } from "@rk/node-fabrik"
import { RItem } from "@rk/types"

export type TableCompProps = {
  noodlNode: NoodlNode
  // params, data
  tableVariant: 'basic' | 'grouped', columns: ColumnDef[], selectable: boolean, items: RItem[], hideHeaders: boolean
  // states
  tableLoading: boolean, tableSearching: boolean
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
  selectedRowColor: string, multiSelectCheckboxColor: string
  // selectable
  singleSelectable: boolean, singleUnselectable: boolean, multiSelectable: boolean, allSelectable: boolean

  //// grouped
  // params
  expendOn: 'row' | 'icon', expandAllAction: boolean
}