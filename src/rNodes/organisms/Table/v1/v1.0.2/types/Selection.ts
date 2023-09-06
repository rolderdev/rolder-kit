import { MRT_RowSelectionState, MRT_TableInstance } from "mantine-react-table"

export type Selection = {
  singleSelection: string
  setSingleSelection: React.Dispatch<React.SetStateAction<string>>
  multiSelection: MRT_RowSelectionState
  setMultiSelection: (statePartial: Partial<MRT_RowSelectionState> | ((currentState: MRT_RowSelectionState) => Partial<MRT_RowSelectionState>)) => void
  allSelected: boolean
  allSelectionHandler: (value: boolean) => void
  partialSelected: boolean
  handleFiltered: (value: boolean) => void
  setSelectionTableInstance: React.Dispatch<React.SetStateAction<MRT_TableInstance<Item> | undefined>>
}