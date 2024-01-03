import { forwardRef, useImperativeHandle, useState } from "react"
import icons from "../../../../../../../libs/icons/v0.2.0/icons"
import { useShallowEffect } from "@mantine/hooks"
import { Select } from "@mantine/core"
import converForSelectInputs from '../../../../../../../utils/converForSelectInputs/v0.2.0/converForSelectInputs'
import convertColor from "../../../../../../../utils/convertColor/v0.2.0/convertColor"
import { getValue8 } from "@rk/utils"
import { sendOutput, sendSignal } from "@rk/node-fabrik"

export default forwardRef(function (props: any, ref) {
    const { noodlNode, defaultItem, inputItems, labelField } = props
    const Icon = icons(props.iconName)

    const defaultValue = defaultItem?.value || defaultItem?.label || defaultItem?.id || null

    const [data, setData] = useState([])
    useShallowEffect(() => {
        const items = inputItems
        if (props.labelField && items?.some((i: any) => getValue8(i, labelField)))
            setData(items.map((i: any) => converForSelectInputs(i, labelField)))
    }, [props])

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
                sendOutput(props.noodlNode, 'createValue', value)
                sendSignal(props.noodlNode, 'createValueSubmited')
            }}
            data={data}
            value={value}
            icon={Icon && <Icon size={props.iconSize} stroke={props.stroke} />}
            error={props.inputError || false}
            onChange={(v) => {
                setValue(v)
                if (!v) {
                    sendOutput(noodlNode, 'selectedItem', null)
                    setTimeout(() => sendSignal(noodlNode, 'reseted'))
                } else {
                    const selectedItem = inputItems.find((i: any) => v && [i.value, i.id, i.label].includes(v))
                    sendOutput(noodlNode, 'selectedItem', selectedItem)
                    setTimeout(() => sendSignal(noodlNode, 'selected'))
                }
            }}
            styles={() => ({
                item: {
                    '&[data-selected]': { '&, &:hover': { backgroundColor: convertColor(props.backgroundColor) }, },
                    '&[data-hovered]': {},
                },
            })}
            {...props}
            {...props.customProps}
        />
    )
})