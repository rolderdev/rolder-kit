import { forwardRef, useState } from "react"
import icons from "../../../../../../../libs/icons/v0.2.0/icons"
import { useDebouncedValue, useId, useShallowEffect } from "@mantine/hooks"
import { CloseButton, Input } from "@mantine/core"
import { IMaskInput } from 'react-imask'
import { sendOutput, sendSignal } from "@rk/node-fabrik"

export default forwardRef(function (props: any) {
    const id = useId()
    const Icon = icons(props.iconName)

    const [value, setValue] = useState<string | number>('')
    const typingDelay = props.debouncedTyping ? props.typingDelay : 0
    const [debouncedTyping] = useDebouncedValue(value, typingDelay)
    useShallowEffect(() => sendOutput(props.noodlNode, 'typedValue', debouncedTyping), [debouncedTyping])

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
        label={props.label}
        withAsterisk={props.withAsterisk}
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
            icon={Icon && <Icon size={props.iconSize} stroke={props.stroke} />}
            rightSection={<CloseButton onClick={() => {
                setValue('')
                sendSignal(props.noodlNode, 'reseted')
            }} />}
            {...props}
            {...maskProps}
            {...props.customProps}
        />
    </Input.Wrapper>
})