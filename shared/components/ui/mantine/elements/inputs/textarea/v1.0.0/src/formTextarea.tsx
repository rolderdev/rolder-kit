import { CloseButton, Textarea } from "@mantine/core"
import { forwardRef, useEffect, useImperativeHandle } from "react"
import { Props } from "../types"
import React from "react"
import { sendOutput, sendSignal } from '@shared/port-send'
import { useFormScope } from "@shared/scope"
import { useDebouncedValue } from '@mantine/hooks'

export default forwardRef(function (props: Props, ref) {
    const formHook = useFormScope()

    const value = formHook?.values?.[props.formField]
    const typingDelay = props.debouncedTyping ? props.typingDelay || 350 : 0
    const [debouncedTyping] = useDebouncedValue(value, typingDelay)

    useEffect(() => {
        if (value?.length === 0) {
            sendOutput(props.noodlNode, 'typedValue', '')
            sendSignal(props.noodlNode, 'reseted')
        } else sendOutput(props.noodlNode, 'typedValue', value)
    }, [debouncedTyping])

    const validationDelay = props.debouncedValidation ? props.validationDelay || 350 : 0
    const [debouncedValidation] = useDebouncedValue(value, validationDelay)
    useEffect(() => {
        if (props.validationType === 'onChange' && debouncedValidation) {
            formHook?.validateField(props.formField)
        }
    }, [debouncedValidation])

    useImperativeHandle(ref, () => ({
        reset() {
            sendOutput(props.noodlNode, 'typedValue', '')
            sendSignal(props.noodlNode, 'reseted')
        }
    }), [])

    return <Textarea
        onBlurCapture={() => {
            if (props.validationType === 'onBlur' && props.scope === 'form') formHook?.validateField(props.formField)
        }}
        {...props}
        {...props.customProps}
        {...formHook?.getInputProps(props.formField)}
    />
})