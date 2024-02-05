import { useMolecule } from "bunshi/react"
import { TableCellMolecule } from "../table/cellScope"
import { FormMolecule } from "../form/formScope"

export type Scope = 'tableCell' | 'form'

export const scopes = {
    tableCell: () => useMolecule(TableCellMolecule),
    form: () => useMolecule(FormMolecule)
}