import { MantineColor, MantineNumberSize } from "@mantine/core"
import { DataTableColumn } from "mantine-datatable"

export type TableCompProps200 = {
  noodlNode: NoodlNode, table2Columns: DataTableColumn<RItem>[], customProps: any
  // Data
  items: RItem[], table2DefaultSort: any[], table2DefaultSelectedItem: RItem,
  // States
  table2Fetching: boolean
  // Layout
  table2NoHeader: boolean, //table2VerticalAlignment: DataTableVerticalAlignment,
  // Dimensions
  table2Width: MantineNumberSize, table2DynamicHeight: boolean, table2MaxHeight: MantineNumberSize,
  table2ViewportBOffset: number, table2HorizontalSpacing: MantineNumberSize, table2VerticalSpacing: MantineNumberSize,
  table2FontSize: MantineNumberSize,
  // Style
  table2Shadow: MantineNumberSize, table2WithBorder: boolean, table2BorderRadius: MantineNumberSize, table2WithColumnBorders: boolean,
  table2Striped: boolean, table2HighlightOnHover: boolean
  // Selectable    
  table2Selectable: boolean, table2SingleRowSelectable: boolean
  // Row style
  table2RowBackgroundColor: MantineColor, table2RowOnHoverBackgroundColor: MantineColor, table2SelectedRowBackgroundColor: MantineColor
}