import { MRT_DensityState } from "mantine-react-table"
import { DefaultMantineColor, MantineNumberSize, MantineShadow } from "@mantine/core"
import { Column } from "./Column"
import { NodeInstance } from "../../../../../../main/getNodes/v0.5.0/types"

export type TableCompProps = {
  // Noodle node
  node: NodeInstance
  // Params
  columns: Column[], selectable: boolean, singleSelect: boolean, singleUnselectable: boolean, multiSelect: boolean, grouped: boolean,
  allSelect: boolean, expandAllAction: boolean
  // Data
  items: NItem[]
  // States
  loading: boolean, tableSearching: boolean
  // Table layout
  tableDensity: MRT_DensityState
  // Table style  
  loaderColor: DefaultMantineColor, loaderSize: MantineNumberSize, withBorder: boolean, shadow: MantineShadow, withColumnBorders: boolean,
  radius: MantineNumberSize
  // Rows style
  highlightOnHover: boolean, onHoverColor: string, backgroundColor: string, selectedColor: string, highlightSelected: boolean,
  multiSelectCheckboxColor: string
}