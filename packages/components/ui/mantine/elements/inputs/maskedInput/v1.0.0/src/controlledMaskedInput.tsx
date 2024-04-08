import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { useDebouncedValue, useId } from "@mantine/hooks"
import { CloseButton, Input } from "@mantine/core"
import { Props } from "../types"
import React from "react"
import { sendOutput, sendSignal } from '@packages/port-send'
import convertColor from "@packages/convert-color"
import { IMaskInput } from "react-imask"

export default forwardRef(function (props: Props, ref) {
    const id = useId()
    const Icon = props.iconName && R.libs.icons[props.iconName]

    const [value, setValue] = useState<string | number>('')
    const typingDelay = props.debouncedTyping ? props.typingDelay || 350 : 0
    const [debouncedTyping] = useDebouncedValue(value, typingDelay)
    useEffect(() => sendOutput(props.noodlNode, 'typedValue', debouncedTyping), [debouncedTyping])

    useEffect(() => {
        if (props.inputValue) {
            setValue(props.inputValue)
            sendOutput(props.noodlNode, 'typedValue', props.inputValue)
        }
    }, [props.inputValue])

    useImperativeHandle(ref, () => ({
        reset() {
            setValue('')
            sendOutput(props.noodlNode, 'typedValue', '')
            sendSignal(props.noodlNode, 'reseted')
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
        error={props.inputError || false}
    >
        <Input<any>
            id={id}
            component={IMaskInput}
            unmask='typed'
            value={value}
            error={props.inputError || false}
            onAccept={(value: string | number) => {
                const parsedValue = value === 0 ? '' : value
                setValue(parsedValue)
            }}
            icon={Icon && <Icon size={props.iconSize} stroke={props.iconStroke} color={convertColor(props.iconColor)} />}
            rightSection={<CloseButton tabIndex={props.focusRightSection ? 0 : -1} onClick={() => {
                setValue('')
                sendOutput(props.noodlNode, 'typedValue', '')
                sendSignal(props.noodlNode, 'reseted')
            }} />}
            {...props}
            {...maskProps}
            {...props.customProps}
        />
    </Input.Wrapper>
})