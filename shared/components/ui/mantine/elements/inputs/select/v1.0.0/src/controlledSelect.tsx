import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Select } from "@mantine/core"
import { Props } from "../types"
import React from "react"
import { sendOutput, sendSignal } from '@shared/port-send'
import convertColor from "@shared/convert-color"
import convertForSelectInputs from '@shared/convert-for-select-inputs'
import getValue from "@shared/get-value"

export default forwardRef(function (props: Props, ref) {
    const Icon = props.iconName && R.libs.icons[props.iconName]
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

    const [value, setValue] = useState<string | null>(null)
    useEffect(() => { if (defaultValue) setValue(defaultValue) }, [defaultValue])
    useEffect(() => {
        if (!value) {
            sendOutput(noodlNode, 'selectedItem', null)
            //sendSignal(noodlNode, 'reseted')
        } else {
            const selectedItem = inputItems?.find((i: any) => value && [i.value, i.id, i.label].includes(value))
            sendOutput(noodlNode, 'selectedItem', selectedItem)
            sendSignal(noodlNode, 'selected')
        }
    }, [value])

    useImperativeHandle(ref, () => ({ resetSelected() { setValue(null) } }), [])

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