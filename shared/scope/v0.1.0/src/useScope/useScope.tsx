import { useMolecule } from "bunshi/react"
import { TableCellMolecule } from "../table/cellScope"
import { Vesrions } from "@shared/types"

export type Scopes = 'tableCell'

export function useScope(scope?: Scopes, version?: Vesrions) {
    const scopes = {
        tableCell: {
            'v0.1.0': useMolecule(TableCellMolecule)
        }
    }

    if (scope && version && scopes[scope]?.[version]) return scopes[scope][version]
}