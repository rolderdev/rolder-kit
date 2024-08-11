import { createScope, molecule } from "bunshi"
import { useMolecule } from "bunshi/react";
import { atom } from "nanostores"

export interface FormValues { [x: string]: any }
export const FormScope = createScope<unknown>(undefined);
export const FormMolecule = molecule((_, scope) => {
    scope(FormScope)
    return atom<FormValues>({})
})

export function useFormScope() {
    const formMol = useMolecule(FormMolecule)
    return formMol.get()
}