import { useMolecule } from "bunshi/react"
import { TableCellMolecule010 } from "../../table/v0.1.0/cellScope"

type Scopes = 'tableCell'

export default function (scope?: Scopes, version?: Vesrions) {    
    const scopes = {
        tableCell: {
            'v0.1.0': useMolecule(TableCellMolecule010)
        }
    }
    
    if (scope && version && scopes[scope]?.[version]) return scopes[scope][version]
}