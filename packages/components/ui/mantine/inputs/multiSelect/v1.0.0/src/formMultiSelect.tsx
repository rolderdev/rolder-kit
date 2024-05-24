import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { MultiSelect } from "@mantine/core"
import type { Props } from "../types"
import convertColor from "@packages/convert-color"
import convertForSelectInputs from '@packages/convert-for-select-inputs'
import getValue from "@packages/get-value"
import { useFormScope } from "@packages/scope"
import { sendOutput, sendSignal } from "@packages/port-send"
import React from "react"

export default forwardRef(function (props: Props, ref) {
    const Icon = props.iconName && R.libs.icons[props.iconName]
    const { noodlNode, inputItems, labelField, formField } = props
    const formHook = useFormScope()

    const [data, setData] = useState<any>([])
    useEffect(() => {
        if (!inputItems?.length) setData([])
        if (inputItems && labelField && inputItems?.some((i: any) => getValue(i, labelField))) {
            const convertedItems = inputItems.map(i => convertForSelectInputs(i, labelField))
            setData(convertedItems.filter(i => i && i.label && i.value))
        }
    }, [inputItems, labelField])

    useEffect(() => {
        if (inputItems) {
            const value = formHook?.values?.[props.formField] || []
            if (value) {
                const selectedItems = inputItems.filter((i: any) => value.includes(i.value) || value.includes(i.id) || value.includes(i.label))
                sendOutput(props.noodlNode, 'selectedItems', selectedItems || [])
                sendSignal(props.noodlNode, 'selected')
            } else sendSignal(props.noodlNode, 'reseted')
        }
    }, [formHook?.values?.[props.formField]])

    useImperativeHandle(ref, () => ({ resetSelected() { formHook?.setFieldValue(props.formField, null) } }), [])
    useEffect(() => { return () => { sendSignal(noodlNode, 'closed') } }, [])

    return <MultiSelect
        data={data}
        getCreateLabel={(value) => `+ Создать "${value}"`}
        onCreate={(value) => {
            sendOutput(noodlNode, 'newValue', value)
            sendSignal(noodlNode, 'newValueSubmited')
        }}
        icon={Icon && <Icon size={props.iconSize} stroke={props.iconStroke} color={convertColor(props.iconColor)} />}
        nothingFound="Не найдено"
        {...props}
        {...props.customProps}
        {...formHook?.getInputProps(formField)}
    />
})
