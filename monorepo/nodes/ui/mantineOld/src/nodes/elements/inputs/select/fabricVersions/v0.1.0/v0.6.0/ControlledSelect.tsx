import { forwardRef, useImperativeHandle, useState } from "react"
import icons from "../../../../../../../libs/icons/v0.2.0/icons"
import { useShallowEffect } from "@mantine/hooks"
import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { Select } from "@mantine/core"
import converForSelectInputs from '../../../../../../../utils/converForSelectInputs/v0.2.0/converForSelectInputs'
import convertColor from "../../../../../../../utils/convertColor/v0.2.0/convertColor"
import getCompProps from "../../../../../../../libs/nodesFabric/v0.1.0/getCompProps/v0.1.0/getCompProps"
import { CompProps } from "./types"

export default forwardRef(function (props: CompProps, ref) {
    const { getValue } = window.R.utils

    const p = { ...getCompProps(props) } as CompProps
    const { noodlNode, iconName, inputItems, labelField, defaultItem } = p

    const Icon = iconName && icons(iconName)

    const defaultValue = defaultItem?.value || defaultItem?.label || defaultItem?.id || null

    const [data, setData] = useState<any[]>([])
    useShallowEffect(() => {
        if (!inputItems?.length) setData([])
        if (inputItems && labelField && inputItems?.some((i: any) => getValue.v8(i, labelField)))
            setData(inputItems.map(i => converForSelectInputs(i, labelField)))
    }, [inputItems, labelField])

    const [value, setValue] = useState<string | null>(null)
    useShallowEffect(() => { if (defaultValue) setValue(defaultValue) }, [defaultValue])

    // reset
    useImperativeHandle(ref, () => ({
        resetSelected() { setValue(null) }
    }), [])

    return (
        <Select
            nothingFound="Не найдено"
            getCreateLabel={(value) => `+ Создать "${value}"`}
            onCreate={(value) => {
                sendOutput(noodlNode, 'createValue', value)
                sendSignal(noodlNode, 'createValueSubmited')
                return undefined
            }}
            data={data}
            value={value}
            icon={Icon && <Icon size={p.iconSize} stroke={p.stroke} />}
            error={p.inputError || false}
            onChange={(v) => {
                setValue(v)
                if (!v) {
                    sendOutput(noodlNode, 'selectedItem', null)
                    setTimeout(() => sendSignal(noodlNode, 'reseted'))
                } else {
                    const selectedItem = inputItems?.find((i: any) => v && [i.value, i.id, i.label].includes(v))
                    sendOutput(noodlNode, 'selectedItem', selectedItem)
                    setTimeout(() => sendSignal(noodlNode, 'selected'))
                }
            }}
            styles={() => ({
                item: {
                    '&[data-selected]': { '&, &:hover': { backgroundColor: convertColor(p.backgroundColor) }, },
                    '&[data-hovered]': {},
                },
            })}
            {...p}
            {...p.customProps}
        />
    )
})