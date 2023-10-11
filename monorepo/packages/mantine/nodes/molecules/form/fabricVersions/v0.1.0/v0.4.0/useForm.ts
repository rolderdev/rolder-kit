import { molecule, createScope } from "bunshi";
import { atom } from "jotai";

export interface FormValues { [x: string]: any }
export const FormHookScope = createScope<unknown>(undefined);
export const FormHookMolecule = molecule((_, scope) => {
    scope(FormHookScope)
    const formHookAtom = atom<FormValues>({})
    const setFormHook = atom(null, (_get, set, formHook: FormValues) => { set(formHookAtom, formHook) })
    return { setFormHook, formHookAtom }
})