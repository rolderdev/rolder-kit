import { forwardRef, useImperativeHandle, useState } from "react"
import icons from "../../../../../../../libs/icons/v0.2.0/icons"
import { useShallowEffect } from "@mantine/hooks"
import { sendOutput, sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { Select } from "@mantine/core"
import converForSelectInputs from '../../../../../../../utils/converForSelectInputs/v0.2.0/converForSelectInputs'
import convertColor from "../../../../../../../utils/convertColor/v0.2.0/convertColor"
import { useMolecule } from "bunshi/react"
import { FormHookMolecule } from "../../../../../../molecules/form/fabricVersions/v0.1.0/v0.4.0/useForm"
import { useAtomValue } from "jotai"

export default forwardRef(function (props: any, ref) {
    const { getValue } = window.R.utils
    const Icon = icons(props.iconName)

    const [data, setData] = useState([])
    useShallowEffect(() => {
        const items = props.inputItems
        if (props.labelField && items?.some((i: any) => getValue.v8(i, props.labelField)))
            setData(items.map((i: any) => converForSelectInputs(i, props.labelField)))
    }, [props])

    const { formHookAtom } = useMolecule(FormHookMolecule)
    const formHook = useAtomValue(formHookAtom)

    useShallowEffect(() => {
        if (props.inputItems) {
            const value = formHook?.values?.[props.formField]
            const selectedItem = props.inputItems.find((i: any) => value && [i.value, i.id, i.label].includes(value))
            sendOutput(props.noodlNode, 'selectedItem', selectedItem || null)
            sendSignal(props.noodlNode, 'selected')
            if (!value) sendSignal(props.noodlNode, 'reseted')
        }
    }, [formHook?.values?.[props.formField]])

    // reset
    useImperativeHandle(ref, () => ({ resetSelected() { formHook?.setFieldValue(props.formField, null) } }), [])

    return <Select
        data={data}
        getCreateLabel={(value) => `+ Создать "${value}"`}
        onCreate={(value) => {
            sendOutput(props.noodlNode, 'createValue', value)
            sendSignal(props.noodlNode, 'createValueSubmited')
        }}
        icon={Icon && <Icon size={props.iconSize} stroke={props.stroke} />}
        nothingFound="Не найдено"
        styles={() => ({
            item: {
                '&[data-selected]': { '&, &:hover': { backgroundColor: convertColor(props.backgroundColor) }, },
                '&[data-hovered]': {},
            },
        })}
        {...props}
        {...props.customProps}
        {...formHook.getInputProps(props.formField)}
    />
})