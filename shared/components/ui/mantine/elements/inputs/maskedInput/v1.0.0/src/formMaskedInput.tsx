import { CloseButton, Input } from "@mantine/core"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Props } from "../types"
import React from "react"
import { sendOutput, sendSignal } from '@shared/port-send'
import { useFormScope } from "@shared/scope"
import { useDebouncedValue, useId } from '@mantine/hooks'
import convertColor from "@shared/convert-color"
import { IMaskInput } from "react-imask"

export default forwardRef(function (props: Props, ref) {
    const id = useId()
    const Icon = props.iconName && R.libs.icons[props.iconName]
    const formHook = useFormScope()

    const [value, setValue] = useState<string | number>(formHook?.values?.[props.formField] || '')
    const typingDelay = props.debouncedTyping ? props.typingDelay || 350 : 0
    const [debouncedTyping] = useDebouncedValue(value, typingDelay)

    useEffect(() => {
        if (!debouncedTyping) {
            formHook?.setFieldValue(props.formField, '')
            sendOutput(props.noodlNode, 'typedValue', '')
            sendSignal(props.noodlNode, 'reseted')
        } else {
            formHook?.setFieldValue(props.formField, debouncedTyping)
            sendOutput(props.noodlNode, 'typedValue', value)
        }
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
            formHook?.setFieldValue(props.formField, '')
        }
    }), [])

    let maskProps = {}
    switch (props.maskType) {
        case 'number': maskProps = {
            mask: Number,
            scale: props.numberScale,
            thousandsSeparator: props.thousandsSeparator,
            radix: props.radix,
            mapToRadix: ['.', ','],
        }; break
        default: maskProps = {
            mask: props.maskPattern,
            lazy: props.hideMaskPattern,
            overwrite: props.overwriteMaskPattern
        }
    }

    return <Input.Wrapper
        id={id}
        error={formHook?.errors[props.formField]}
        {...props}
    >
        <Input<any>
            id={id}
            component={IMaskInput}
            unmask='typed'
            value={value}
            error={formHook?.errors[props.formField]}
            onAccept={(value: string | number) => {
                const parsedValue = value === 0 ? '' : value
                setValue(parsedValue)
            }}
            icon={Icon && <Icon size={props.iconSize} stroke={props.iconStroke} color={convertColor(props.iconColor)} />}
            rightSection={<CloseButton tabIndex={props.focusRightSection ? 0 : -1} onClick={() => {
                sendOutput(props.noodlNode, 'typedValue', '')
                sendSignal(props.noodlNode, 'reseted')
            }} />}
            onBlurCapture={() => {
                if (props.validationType === 'onBlur' && props.scope === 'form') formHook?.validateField(props.formField)
            }}
            {...props}
            {...maskProps}
            {...props.customProps}
        />
    </Input.Wrapper>


})