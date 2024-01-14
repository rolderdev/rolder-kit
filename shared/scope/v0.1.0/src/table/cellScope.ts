import { RItem } from "@shared/types";
import { createScope, molecule } from "bunshi";
import { atom } from "nanostores";

export const TableCellScope = createScope<unknown>(undefined);
export const TableCellMolecule = molecule((_, scope) => {
    scope(TableCellScope)
    const item = atom<RItem | undefined>()
    return { item }
})