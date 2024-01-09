import { useMolecule } from "bunshi/react"
import { TableCellMolecule010 } from "../table/cellScope"
import { Vesrions } from "@rk/types"

export type Scopes = 'tableCell'

export function useScope(scope?: Scopes, version?: Vesrions) {
    const scopes = {
        tableCell: {
            'v0.1.0': useMolecule(TableCellMolecule010)
        }
    }

    if (scope && version && scopes[scope]?.[version]) return scopes[scope][version]
}