import { forwardRef, useEffect, useImperativeHandle } from "react"
import { Checkbox } from "@mantine/core"
import { Props } from "../types"
import convertColor from "@shared/convert-color"
import { useFormScope } from "@shared/scope"
import { sendOutput, sendSignal } from "@shared/port-send"
import React from "react"

export default forwardRef(function (props: Props, ref) {
    const Icon = props.iconName && R.libs.icons[props.iconName]
    const formHook = useFormScope()

    const value = formHook?.values?.[props.formField]
    useEffect(() => {
        sendOutput(props.noodlNode, 'checked', value)
        sendSignal(props.noodlNode, 'changed')
    }, [value])

    useImperativeHandle(ref, () => ({
        reset() {
            formHook?.setFieldValue(props.formField, false)
            sendOutput(props.noodlNode, 'checked', false)
        }
    }), [])

    return (
        <Checkbox
            icon={Icon && <Icon size={props.iconSize} stroke={props.iconStroke} color={convertColor(props.iconColor)} />}
            {...props}
            {...props.customProps}
            {...formHook?.getInputProps(props.formField, { type: 'checkbox' })}
        />
    )
})