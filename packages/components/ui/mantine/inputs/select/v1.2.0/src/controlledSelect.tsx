import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Select, type SelectItem } from "@mantine/core"
import type { Props } from "../types"
import React from "react"
import { sendOutput, sendSignal } from '@packages/port-send'
import convertColor from "@packages/convert-color"
import convertForSelectInputs from '@packages/convert-for-select-inputs'
import getValue from "@packages/get-value"

export default forwardRef(function (props: Props, ref) {
    const Icon = props.iconName && R.libs.icons[props.iconName]
    const { noodlNode, inputItems, labelField, selectedItem } = props

    const [data, setData] = useState<SelectItem[]>([])
    useEffect(() => {
        if (!inputItems?.length) setData([])
        if (inputItems && labelField && inputItems?.some(i => getValue(i, labelField))) {
            const convertedItems = inputItems.map(i => convertForSelectInputs(i, labelField))
            setData(convertedItems.filter(i => i && i.label && i.value))
        }
    }, [inputItems, labelField])

    const [value, setValue] = useState<string | null>(null)
    useEffect(() => {
        if (!value) {
            sendOutput(noodlNode, 'selectedItem', null)
            sendSignal(noodlNode, 'reseted')
        } else {
            const selectedItem = inputItems?.find(i => [i.value, i.id, i.label].includes(value))
            sendOutput(noodlNode, 'selectedItem', selectedItem)
            sendSignal(noodlNode, 'selected')
        }
    }, [value])

    useImperativeHandle(ref, () => ({
        select() { setValue(selectedItem?.value || selectedItem?.label || selectedItem?.id || null) },
        resetSelected() { setValue(null) }
    }), [selectedItem])

    return <Select
        nothingFound="Не найдено"
        getCreateLabel={(value) => `+ Создать "${value}"`}
        onCreate={(value) => {
            sendOutput(noodlNode, 'newValue', value)
            sendSignal(noodlNode, 'newValueSubmited')
            return undefined
        }}
        data={data}
        value={value}
        icon={Icon && <Icon size={props.iconSize} stroke={props.iconStroke} color={convertColor(props.iconColor)} />}
        error={props.inputError || false}
        onChange={setValue}
        styles={() => ({
            item: {
                '&[data-selected]': { '&, &:hover': { backgroundColor: convertColor(props.backgroundColor) }, },
                '&[data-hovered]': {},
            },
        })}
        {...props}
        {...props.customProps}
    />
})
