import { CloseButton, TextInput } from "@mantine/core"
import { forwardRef, useEffect, useImperativeHandle } from "react"
import { Props } from "../types"
import React from "react"
import { sendOutput, sendSignal } from '@packages/port-send'
import { useFormScope } from "@packages/scope"
import { useDebouncedValue } from '@mantine/hooks'
import convertColor from "@packages/convert-color"

export default forwardRef(function (props: Props, ref) {
    const Icon = props.iconName && R.libs.icons[props.iconName]
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

    return <TextInput
        icon={Icon && <Icon size={props.iconSize} stroke={props.iconStroke} color={convertColor(props.iconColor)} />}
        rightSection={<CloseButton tabIndex={props.focusRightSection ? 0 : -1} onClick={() => {
            formHook?.validateField('')
            sendOutput(props.noodlNode, 'typedValue', '')
            sendSignal(props.noodlNode, 'reseted')
        }} />}
        onBlurCapture={() => {
            if (props.validationType === 'onBlur' && props.scope === 'form') formHook?.validateField(props.formField)
        }}
        {...props}
        {...props.customProps}
        {...formHook?.getInputProps(props.formField)}
    />
})