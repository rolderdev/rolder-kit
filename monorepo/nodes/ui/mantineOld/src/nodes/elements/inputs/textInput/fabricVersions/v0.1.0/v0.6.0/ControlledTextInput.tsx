import { forwardRef, useImperativeHandle, useState } from "react"
import icons from "../../../../../../../libs/icons/v0.2.0/icons"
import { useDebouncedValue, useShallowEffect } from "@mantine/hooks"
import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { CloseButton, TextInput } from "@mantine/core"

export default forwardRef(function (props: any, ref) {
    const Icon = icons(props.iconName)

    const [value, setValue] = useState<string | number>('')
    const typingDelay = props.debouncedTyping ? props.typingDelay : 0
    const [debouncedTyping] = useDebouncedValue(value, typingDelay)
    useShallowEffect(() => sendOutput(props.noodlNode, 'typedValue', debouncedTyping), [debouncedTyping])

    // reset
    useImperativeHandle(ref, () => ({
        reset() {
            setValue('')
            sendOutput(props.noodlNode, 'typedValue', '')
            sendSignal(props.noodlNode, 'reseted')
        }
    }), [])

    return (
        <TextInput
            value={value}
            icon={Icon && <Icon size={props.iconSize} stroke={props.stroke} />}
            rightSection={<CloseButton onClick={() => {
                setValue('')
                sendOutput(props.noodlNode, 'typedValue', '')
                sendSignal(props.noodlNode, 'reseted')
            }} />}
            error={props.inputError || false}
            onChange={(e) => {
                setValue(e.target.value)
                if (e.target.value?.length === 0) {
                    sendOutput(props.noodlNode, 'typedValue', '')
                    sendSignal(props.noodlNode, 'reseted')
                }
            }}
            {...props}
            {...props.customProps}
        />
    )
})