import { PasswordInput } from "@mantine/core"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Props } from "../types"
import React from "react"
import { sendOutput, sendSignal } from '@packages/port-send'
import { useFormScope } from "@packages/scope"
import { useDebouncedValue } from '@mantine/hooks'

export default forwardRef(function (props: Props, ref) {
    const formHook = useFormScope()

    const value = formHook?.values?.[props.formField]
    useEffect(() => {
        if (value?.length === 0) {
            sendOutput(props.noodlNode, 'typedValue', '')
            sendSignal(props.noodlNode, 'reseted')
        } else sendOutput(props.noodlNode, 'typedValue', value)
    }, [value])

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

    return <PasswordInput
        onBlurCapture={() => {
            if (props.validationType === 'onBlur' && props.scope === 'form') formHook?.validateField(props.formField)
        }}
        toggleTabIndex={props.focusRightSection ? 0 : undefined}
        {...props}
        {...props.customProps}
        {...formHook?.getInputProps(props.formField)}
    />
})