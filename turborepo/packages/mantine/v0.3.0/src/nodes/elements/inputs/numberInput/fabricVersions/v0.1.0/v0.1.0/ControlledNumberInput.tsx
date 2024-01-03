import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import icons from "../../../../../../../libs/icons/v0.2.0/icons"
import { NumberInput, NumberInputHandlers } from "@mantine/core"
import { sendOutput } from "@rk/node-fabrik"

export default forwardRef(function (props: any, ref) {
    const Icon = icons(props.iconName)

    const [value, setValue] = useState<number | ''>(props.defaultNumberValue)
    const handlers = useRef<NumberInputHandlers>();

    useImperativeHandle(ref, () => ({
        reset() {
            setValue(props.defaultNumberValue || 0)
            sendOutput(props.noodlNode, 'value', props.defaultNumberValue || 0)
        },
        increment() { handlers.current?.increment() },
        decrement() { handlers.current?.decrement() }
    }), [])

    return (
        <NumberInput
            value={value}
            variant={props.numberInputVariant}
            icon={Icon && <Icon size={props.iconSize} stroke={props.stroke} />}
            error={props.inputError || false}
            onChange={(e) => {
                setValue(e)
                sendOutput(props.noodlNode, 'value', e)
            }}
            handlersRef={handlers}
            {...props}
            {...props.customProps}
        />
    )
})