import { NodeInstance } from "@noodl/noodl-sdk"
import { MRT_DensityState } from "mantine-react-table"
import { DefaultMantineColor, MantineNumberSize, MantineShadow } from "@mantine/core"
import { Column } from "./Column"

export type TableCompProps = {
  // Noodle node
  noodlNode: NodeInstance
  // Params
  columns: Column[], selectable: boolean, singleSelect: boolean, singleUnselectable: boolean, multiSelect: boolean, grouped: boolean,
  allSelect: boolean, expandAllAction: boolean
  // Data
  items: Item[]
  // States
  loading: boolean, searching: boolean
  // Table layout
  tableDensity: MRT_DensityState
  // Table style  
  loaderColor: DefaultMantineColor, loaderSize: MantineNumberSize, withBorder: boolean, shadow: MantineShadow, withColumnBorders: boolean,
  radius: MantineNumberSize
  // Rows style
  highlightOnHover: boolean, onHoverColor: string, backgroundColor: string, selectedColor: string, highlightSelected: boolean,
  multiSelectCheckboxColor: string
}