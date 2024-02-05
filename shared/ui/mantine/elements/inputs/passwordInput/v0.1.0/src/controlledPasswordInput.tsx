import { PasswordInput } from "@mantine/core"
import { forwardRef, useImperativeHandle, useState } from "react"
import { Props } from "./../types"
import React from "react"
import { sendOutput, sendSignal } from '@shared/port-send'

export default forwardRef(function (props: Props, ref) {
        
    const [value, setValue] = useState<string | number>('')

    useImperativeHandle(ref, () => ({
        reset() {
            setValue('')
            sendOutput(props.noodlNode, 'typedValue', '')
            sendSignal(props.noodlNode, 'reseted')
        }
    }), [])

    return <PasswordInput
        value={value}
        onChange={(e) => {
            setValue(e.target.value)
            if (e.target.value?.length === 0) {
                sendOutput(props.noodlNode, 'typedValue', '')
                sendSignal(props.noodlNode, 'reseted')
            } else sendOutput(props.noodlNode, 'typedValue', e.target.value)
        }}
        toggleTabIndex={0}
        {...props}
        {...props.customProps}
    />
})