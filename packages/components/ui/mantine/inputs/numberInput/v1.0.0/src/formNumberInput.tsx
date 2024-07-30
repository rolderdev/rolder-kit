import { NumberInput, NumberInputHandlers } from "@mantine/core"
import { forwardRef, useImperativeHandle, useRef } from "react"
import type { Props } from "../types"
import { sendOutput, sendSignal } from '@packages/port-send'
import { useFormScope } from "@packages/scope"
import convertColor from "@packages/convert-color"

export default forwardRef(function (props: Props, ref) {
    const Icon = props.iconName && R.libs.icons[props.iconName]
    const formHook = useFormScope()

    const handlers = useRef<NumberInputHandlers>()
    // reset
    useImperativeHandle(ref, () => ({
        reset() {
            formHook?.setFieldValue(props.formField, props.defaultNumberValue || 0)
            //@ts-ignore
            sendOutput(props.noodlNode, 'value', props.defaultNumberValue || 0)
        },
        increment() { handlers.current?.increment() },
        decrement() { handlers.current?.decrement() }
    }), [])

    return <NumberInput
        value={formHook?.values?.[props.formField]}
        variant={props.numberInputVariant}
        icon={Icon && <Icon size={props.iconSize} stroke={props.iconStroke} color={convertColor(props.iconColor)} />}
        error={formHook?.errors?.[props.formField]}
        onChange={(e) => {
            formHook?.setFieldValue(props.formField, e)
            if (e === '') {
                //@ts-ignore
                sendOutput(props.noodlNode, 'value', e)
                sendSignal(props.noodlNode, 'reseted')
            } else {
                //@ts-ignore
                sendOutput(props.noodlNode, 'value', e)
                sendSignal(props.noodlNode, 'changed')
            }
        }}
        handlersRef={handlers}
        {...props}
        {...props.customProps}
    />
})
