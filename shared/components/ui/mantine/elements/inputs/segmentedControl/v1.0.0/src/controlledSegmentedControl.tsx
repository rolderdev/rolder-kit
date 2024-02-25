import { forwardRef, useEffect, useState } from "react"
import { SegmentedControl } from "@mantine/core"
import { Props } from "../types"
import React from "react"
import { sendOutput, sendSignal } from '@shared/port-send'
import convertForSelectInputs from '@shared/convert-for-select-inputs'
import getValue from "@shared/get-value"

export default forwardRef(function (props: Props) {
    const { noodlNode, inputItems, labelField, defaultItem } = props

    const defaultValue = defaultItem?.value || defaultItem?.label || defaultItem?.id || null

    const [data, setData] = useState<any>([])
    useEffect(() => {
        if (!inputItems?.length) setData([])
        if (inputItems && labelField && inputItems?.some((i: any) => getValue(i, labelField))) {
            const convertedItems = inputItems.map(i => convertForSelectInputs(i, labelField))
            setData(convertedItems.filter(i => i && i.label && i.value))
        }
    }, [inputItems, labelField])

    const [value, setValue] = useState<string | undefined>()
    useEffect(() => { if (defaultValue) setValue(defaultValue) }, [defaultValue])

    return <SegmentedControl
        data={data}
        value={value}
        onChange={(v) => {
            setValue(v)
            const selectedItem = inputItems?.find((i: any) => v && [i.value, i.id, i.label].includes(v))
            sendOutput(noodlNode, 'selectedItem', selectedItem)
            sendSignal(noodlNode, 'selected')
        }}
        {...props}
        {...props.customProps}
    />
})