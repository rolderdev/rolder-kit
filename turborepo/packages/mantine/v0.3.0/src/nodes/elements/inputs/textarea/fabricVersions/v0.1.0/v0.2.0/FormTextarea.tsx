import { forwardRef, useState } from "react"
import { useDebouncedValue, useShallowEffect } from "@mantine/hooks"
import { sendOutput, sendSignal } from '@rk/node-fabrik'
import { useMolecule } from "bunshi/react"
import { FormHookMolecule } from "../../../../../../molecules/form/fabricVersions/v0.1.0/v0.4.0/useForm"
import { useAtomValue } from "jotai"
import { Textarea } from "@mantine/core"

export default forwardRef(function (props: any) {
    const { formHookAtom } = useMolecule(FormHookMolecule)
    const formHook = useAtomValue(formHookAtom)
    const [value, setValue] = useState<string | number>('')
    const typingDelay = props.debouncedTyping ? props.typingDelay : 0
    const [debouncedTyping] = useDebouncedValue(value, typingDelay)
    useShallowEffect(() => sendOutput(props.noodlNode, 'typedValue', debouncedTyping), [debouncedTyping])

    const validationDelay = props.debouncedValidation ? props.validationDelay : 0
    const [debouncedValidation] = useDebouncedValue(value, validationDelay)
    useShallowEffect(() => {
        if (props.validationType === 'onChange' && debouncedValidation) formHook.validateField(props.formField)
    }, [debouncedValidation])

    return (
        <Textarea
            variant={props.textareaVariant}
            value={formHook?.values?.[props.formField]}
            error={formHook?.errors?.[props.formField]}
            onChange={(e) => {
                formHook?.setFieldValue(props.formField, e.target.value)
                setValue(e.target.value)
                if (e.target.value?.length === 0) sendSignal(props.noodlNode, 'reseted')
            }}
            onBlurCapture={() => { if (props.validationType === 'onBlur' && props.useForm) formHook.validateField(props.formField) }}
            {...props}
            {...props.customProps}
        />
    )
})