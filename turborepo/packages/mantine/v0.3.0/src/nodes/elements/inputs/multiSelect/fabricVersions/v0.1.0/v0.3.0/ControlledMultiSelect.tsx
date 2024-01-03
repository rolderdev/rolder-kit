import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import icons from "../../../../../../../libs/icons/v0.2.0/icons"
import { useShallowEffect } from "@mantine/hooks"
import converForSelectInputs from '../../../../../../../utils/converForSelectInputs/v0.2.0/converForSelectInputs'
import { MultiSelect } from "@mantine/core"
import { getValue8 } from "@rk/utils"
import { sendOutput, sendSignal } from "@rk/node-fabrik"

export default forwardRef(function (props: any, ref) {
    const { noodlNode, inputItems, labelField, defaultItems } = props
    const Icon = icons(props.iconName)

    const [data, setData] = useState([])
    useShallowEffect(() => {
        const items = inputItems
        if (labelField && items?.some((i: any) => getValue8(i, labelField)))
            setData(items.map((i: any) => converForSelectInputs(i, labelField)))
    }, [inputItems, labelField])

    const [value, setValue] = useState<string[]>([]);
    useShallowEffect(() => {
        if (defaultItems) {
            const value = defaultItems?.map((i: any) => i.value || i.id || i.label) || []
            setValue(value)
        }
    }, [defaultItems])

    useImperativeHandle(ref, () => ({
        resetSelected() {
            setValue([])
            sendOutput(noodlNode, 'selectedItems', [])
            setTimeout(() => sendSignal(noodlNode, 'reseted'))
        }
    }), [])
    useEffect(() => { return () => { sendSignal(noodlNode, 'closed') } }, [])

    return <MultiSelect
        data={data}
        value={value}
        onChange={(v) => {
            setValue(v)
            if (!v) {
                sendOutput(noodlNode, 'selectedItems', [])
                setTimeout(() => sendSignal(noodlNode, 'reseted'))
            } else {
                const selectedItems = props.inputItems.filter((i: any) => v.includes(i.value) || v.includes(i.id) || v.includes(i.label))
                sendOutput(noodlNode, 'selectedItems', selectedItems)
                setTimeout(() => sendSignal(noodlNode, 'selected'))
            }
        }}
        getCreateLabel={(value) => `+ Создать "${value}"`}
        onCreate={(value) => {
            sendOutput(noodlNode, 'createValue', value)
            setTimeout(() => sendSignal(noodlNode, 'createValueSubmited'))
        }}
        icon={Icon && <Icon size={props.iconSize} stroke={props.stroke} />}
        error={props.inputError || false}
        nothingFound="Не найдено"
        {...props}
        {...props.customProps}
    />
})