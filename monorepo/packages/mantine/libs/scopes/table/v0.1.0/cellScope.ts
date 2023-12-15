import { createScope, molecule } from "bunshi";
import { atom } from "nanostores";

export const TableCellScope010 = createScope<unknown>(undefined);
export const TableCellMolecule010 = molecule((_, scope) => {
    scope(TableCellScope010)
    const cellItem = atom<RItem | undefined>()
    return { cellItem }
})