import { forwardRef } from "react"
import { sendOutput, sendSignal } from "../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { useForm } from '@mantine/form';
import { ScopeProvider, useMolecule } from "bunshi/react";
import { FormHookMolecule, FormHookScope, FormValues } from "./useForm";
import { useSetAtom } from "jotai";

export default forwardRef(function (props: any) {
    const formId = Symbol()
    const formHookAtoms = useMolecule(FormHookMolecule, { withScope: [FormHookScope, formId] })
    const setFormHook = useSetAtom(formHookAtoms.setFormHook)

    function Form(formScheme: FormValues) {
        const form = useForm<FormValues>(formScheme)
        setFormHook(form)
        sendOutput(props.noodlNode, 'formHook', form)

        return <ScopeProvider scope={FormHookScope} value={formId}>
            <form onSubmit={form.onSubmit(() => sendSignal(props.noodlNode, 'submited'))}>
                {props.children}
            </form>
        </ScopeProvider>
    }

    return props.formScheme ? <Form {...props.formScheme} /> : <></>
})