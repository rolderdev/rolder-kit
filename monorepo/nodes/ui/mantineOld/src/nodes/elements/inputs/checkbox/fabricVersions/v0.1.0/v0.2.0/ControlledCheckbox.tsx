import { forwardRef, useImperativeHandle, useState } from "react"
import icons from "../../../../../../../libs/icons/v0.2.0/icons"
import { useShallowEffect } from "@mantine/hooks"
import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { Checkbox } from "@mantine/core"

export default forwardRef(function (props: any, ref) {
    const { getValue } = window.R.utils
    const Icon = icons(props.iconName)

    const [checked, setChecked] = useState(false);
    const [label, setLabel] = useState('')
    useShallowEffect(() => {
        const label = getValue.v8(props.item, props.labelField)
        if (label) setLabel(label)
    }, [props])

    // reset
    useImperativeHandle(ref, () => ({
        reset() {
            setChecked(false)
            sendOutput(props.noodlNode, 'checked', false)
        }
    }), [])

    return (
        <Checkbox
            label={label}
            error={props.inputError || false}
            icon={Icon && <Icon size={props.iconSize} stroke={props.stroke} />}
            checked={checked}
            onChange={(event) => {
                setChecked(event.currentTarget.checked)
                sendOutput(props.noodlNode, 'checked', event.currentTarget.checked)
                sendSignal(props.noodlNode, 'changed')
            }}
            {...props}
            {...props.customProps}
        />
    )
})