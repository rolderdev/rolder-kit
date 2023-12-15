import { createScope, molecule } from "bunshi";
import { atom } from "nanostores";

export const CellScope = createScope<unknown>(undefined);
export const CellMolecule = molecule((_, scope) => {
    scope(CellScope)
    const cellItem = atom<RItem | undefined>()
    return { cellItem }
})