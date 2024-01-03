import { forwardRef, useImperativeHandle, useState } from "react"
import icons from "../../../../../../../libs/icons/v0.2.0/icons"
import { useShallowEffect } from "@mantine/hooks"
import { MultiSelect } from "@mantine/core"
import converForSelectInputs from '../../../../../../../utils/converForSelectInputs/v0.2.0/converForSelectInputs'
import { useMolecule } from "bunshi/react"
import { FormHookMolecule } from "../../../../../../molecules/form/fabricVersions/v0.1.0/v0.4.0/useForm"
import { useAtomValue } from "jotai"
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

    const { formHookAtom } = useMolecule(FormHookMolecule)
    const formHook = useAtomValue(formHookAtom)

    useShallowEffect(() => {
        if (props.inputItems) {
            const value = formHook?.values?.[props.formField]
            const selectedItems = props.inputItems.filter((i: any) => value.includes(i.value) || value.includes(i.id) || value.includes(i.label))
            sendOutput(props.noodlNode, 'selectedItems', selectedItems || [])
            sendSignal(props.noodlNode, 'selected')
            if (!value) sendSignal(props.noodlNode, 'reseted')
        }
    }, [formHook?.values?.[props.formField]])

    // reset
    useImperativeHandle(ref, () => ({ resetSelected() { formHook?.setFieldValue(props.formField, null) } }), [])

    return <MultiSelect
        data={data}
        getCreateLabel={(value) => `+ Создать "${value}"`}
        onCreate={(value) => {
            sendOutput(props.noodlNode, 'createValue', value)
            sendSignal(props.noodlNode, 'createValueSubmited')
        }}
        icon={Icon && <Icon size={props.iconSize} stroke={props.stroke} />}
        nothingFound="Не найдено"
        {...props}
        {...props.customProps}
        {...formHook.getInputProps(props.formField)}
    />
})