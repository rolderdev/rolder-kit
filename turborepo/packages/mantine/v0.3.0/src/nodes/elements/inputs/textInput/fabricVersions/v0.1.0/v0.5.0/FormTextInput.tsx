import { forwardRef, useState } from "react"
import icons from "../../../../../../../libs/icons/v0.2.0/icons"
import { useDebouncedValue, useShallowEffect } from "@mantine/hooks"
import { CloseButton, TextInput } from "@mantine/core"
import { useMolecule } from "bunshi/react"
import { FormHookMolecule } from "../../../../../../molecules/form/fabricVersions/v0.1.0/v0.4.0/useForm"
import { useAtomValue } from "jotai"
import { getCompProps, sendOutput, sendSignal } from '@rk/node-fabrik'

export default forwardRef(function (props: any) {
    const Icon = icons(props.iconName)

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
        <TextInput
            value={formHook?.values?.[props.formField]}
            icon={Icon && <Icon size={props.iconSize} stroke={props.stroke} />}
            rightSection={<CloseButton onClick={() => {
                formHook?.setFieldValue(props.formField, '')
                setValue('')
                sendSignal(props.noodlNode, 'reseted')
            }} />}
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