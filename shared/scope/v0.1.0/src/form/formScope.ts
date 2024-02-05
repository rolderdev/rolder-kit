import { createScope, molecule } from "bunshi"
import { atom } from "nanostores"

export interface FormValues { [x: string]: any }
export const FormScope = createScope<unknown>(undefined);
export const FormMolecule = molecule((_, scope) => {
    scope(FormScope)    
    return atom<FormValues>({})
})