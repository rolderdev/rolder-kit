import { MantineColor, MantineNumberSize } from "@mantine/core"
import { ColumnDef200 } from "./Column"

export type TableCompProps200 = {
  // Enablers
  table2SingleSelection: boolean, table2MultiSelection: boolean, table2Sort: boolean, table2Layout: boolean, table2Dimensions: boolean
  table2TableStyles: boolean, table2RowStyles: boolean,
  // Params
  noodlNode: NoodlNode, table2Columns: ColumnDef200[], customProps: any, children: any
  table2OnRowClick: 'disabled' | 'singleSelection' | 'expansion', table2TextSelection: boolean
  // Data
  table2Items: RItem[]
  // Single selection
  table2SingleSelectedItem: RItem, table2Unselectable: boolean
  // Multi selection
  table2MultiSelectedItems: RItem[]
  // Sort
  table2SortType: 'frontend' | 'backend', table2SortedIcon?: string, table2UnsortedIcon?: string

  // Layout
  table2NoHeader: boolean
  // Dimensions
  table2Width: MantineNumberSize, table2MinHeight: MantineNumberSize, table2DynamicHeight: boolean, table2MaxHeight: MantineNumberSize,
  table2ViewportBOffset: number, table2HorizontalSpacing: MantineNumberSize, table2VerticalSpacing: MantineNumberSize,
  table2FontSize: MantineNumberSize,
  // Table styles
  table2Shadow: MantineNumberSize, table2WithBorder: boolean, table2BorderRadius: MantineNumberSize, table2ColumnBorders: boolean,
  table2Animation: boolean, table2LoaderColor: MantineColor,
  // Row styles
  table2RowBorders: boolean, table2Striped: boolean, table2OddBgColor: MantineColor, table2EvenBgColor: MantineColor,
  table2RowBgColor: MantineColor, table2HighlightOnHover: boolean, table2OnHoverBgColor: MantineColor,
  table2SingleSelectedRowBgColor: MantineColor, table2MutliSelectedRowBgColor: MantineColor,  
  // States
  table2Fetching: boolean
}