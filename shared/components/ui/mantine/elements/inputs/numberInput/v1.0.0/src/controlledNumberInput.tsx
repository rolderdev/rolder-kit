import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { NumberInput, NumberInputHandlers } from "@mantine/core"
import { Props } from "../types"
import React from "react"
import { sendOutput, sendSignal } from '@shared/port-send'
import convertColor from "@shared/convert-color"
import isEmpty from "@shared/is-empty"

export default forwardRef(function (props: Props, ref) {
    const Icon = props.iconName && R.libs.icons[props.iconName]

    const [value, setValue] = useState<number | ''>('')
    const handlers = useRef<NumberInputHandlers>()

    useEffect(() => {
        if (isEmpty(props.defaultNumberValue)) setValue('')
        else setValue(props.defaultNumberValue)
    }, [props.defaultNumberValue])

    useImperativeHandle(ref, () => ({
        reset() {
            setValue(props.defaultNumberValue || 0)
            //@ts-ignore
            sendOutput(props.noodlNode, 'value', props.defaultNumberValue || 0)
        },
        increment() { handlers.current?.increment() },
        decrement() { handlers.current?.decrement() }
    }), [])

    return <NumberInput
        value={value}
        variant={props.numberInputVariant}
        icon={Icon && <Icon size={props.iconSize} stroke={props.iconStroke} color={convertColor(props.iconColor)} />}
        error={props.inputError || false}
        onChange={(e) => {
            setValue(e)
            //@ts-ignore
            sendOutput(props.noodlNode, 'value', e)
            sendSignal(props.noodlNode, 'changed')
        }}
        handlersRef={handlers}
        {...props}
        {...props.customProps}
    />
})