import { forwardRef, useImperativeHandle, useState } from "react"
import icons from "../../../../../../../libs/icons/v0.2.0/icons"
import { useShallowEffect } from "@mantine/hooks"
import { Select } from "@mantine/core"
import converForSelectInputs from '../../../../../../../utils/converForSelectInputs/v0.2.0/converForSelectInputs'
import convertColor from "../../../../../../../utils/convertColor/v0.2.0/convertColor"
import { getValue8 } from "@rk/utils"
import { sendOutput, sendSignal } from "@rk/node-fabrik"

export default forwardRef(function (props: any, ref) {
    const Icon = icons(props.iconName)

    const [data, setData] = useState([])
    useShallowEffect(() => {
        const items = props.inputItems
        if (props.labelField && items?.some((i: any) => getValue8(i, props.labelField)))
            setData(items.map((i: any) => converForSelectInputs(i, props.labelField)))
    }, [props])

    const [value, setValue] = useState<string | null>(null);
    useShallowEffect(() => {
        if (props.inputItems) {
            const selectedItem = props.inputItems.find((i: any) => value && [i.value, i.id, i.label].includes(value))
            sendOutput(props.noodlNode, 'selectedItem', selectedItem || null)
            sendSignal(props.noodlNode, 'selected')
        }
    }, [value])

    useShallowEffect(() => {
        if (props.defaultItem) {
            const value = props.defaultItem.value || props.defaultItem.label || props.defaultItem.id || null
            setValue(value)
        }
    }, [props.defaultItem])

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
                if (!v) sendSignal(props.noodlNode, 'reseted')
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