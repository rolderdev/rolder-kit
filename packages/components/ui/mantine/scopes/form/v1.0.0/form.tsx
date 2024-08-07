import { forwardRef } from "react"
import { useForm } from '@mantine/form';
import { ScopeProvider, useMolecule } from "bunshi/react";
import { FormMolecule, FormScope, FormValues } from "@packages/scope";
import type { Props } from "./types";
import { sendOutput, sendSignal } from "@packages/port-send";;
import { useId } from "@mantine/hooks";

export default forwardRef(function (props: Props) {
    const formId = useId()
    const formHook = useMolecule(FormMolecule, { withScope: [FormScope, formId] })

    function Form(formScheme: FormValues) {
        const form = useForm<FormValues>(formScheme)
        formHook.set(form)
        sendOutput(props.noodlNode, 'formHook', form)

        return <ScopeProvider scope={FormScope} value={formId}>
            <form
                onSubmit={form.onSubmit(() => sendSignal(props.noodlNode, 'submited'))}
                style={props.style}
            >
                {props.children}
            </form>
        </ScopeProvider>
    }

    return props.formScheme ? <Form {...props.formScheme} /> : null
})
