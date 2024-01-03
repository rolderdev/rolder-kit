import { forwardRef, useImperativeHandle, useState } from "react"
import icons from "../../../../../../../libs/icons/v0.2.0/icons"
import { useShallowEffect } from "@mantine/hooks"
import { getCompProps, sendOutput, sendSignal } from '@rk/node-fabrik'
import { Select } from "@mantine/core"
import converForSelectInputs from '../../../../../../../utils/converForSelectInputs/v0.2.0/converForSelectInputs'
import convertColor from "../../../../../../../utils/convertColor/v0.2.0/convertColor"
import { useMolecule } from "bunshi/react"
import { FormHookMolecule } from "../../../../../../molecules/form/fabricVersions/v0.1.0/v0.4.0/useForm"
import { useAtomValue } from "jotai"
import { CompProps } from "./types"
import { getValue8 } from "@rk/utils"

export default forwardRef(function (props: CompProps, ref) {
    const p = { ...getCompProps(props) } as CompProps
    const { noodlNode, iconName, inputItems, labelField, formField } = p

    const Icon = iconName && icons(iconName)

    const [data, setData] = useState<any[]>([])
    useShallowEffect(() => {
        if (!inputItems?.length) setData([])
        if (inputItems && labelField && inputItems?.some((i: any) => getValue8(i, labelField)))
            setData(inputItems.map(i => converForSelectInputs(i, labelField)))
    }, [inputItems, labelField])

    const { formHookAtom } = useMolecule(FormHookMolecule)
    const formHook = useAtomValue(formHookAtom)

    useShallowEffect(() => {
        if (inputItems) {
            const value = formHook?.values?.[formField]
            const selectedItem = inputItems.find((i: any) => value && [i.value, i.id, i.label].includes(value))
            sendOutput(noodlNode, 'selectedItem', selectedItem || null)
            sendSignal(noodlNode, 'selected')
            if (!value) sendSignal(noodlNode, 'reseted')
        }
    }, [formHook?.values?.[formField]])

    // reset
    useImperativeHandle(ref, () => ({ resetSelected() { formHook?.setFieldValue(formField, null) } }), [])

    return <Select
        data={data}
        getCreateLabel={(value) => `+ Создать "${value}"`}
        onCreate={(value) => {
            sendOutput(noodlNode, 'createValue', value)
            sendSignal(noodlNode, 'createValueSubmited')
        }}
        icon={Icon && <Icon size={p.iconSize} stroke={p.stroke} />}
        nothingFound="Не найдено"
        styles={() => ({
            item: {
                '&[data-selected]': { '&, &:hover': { backgroundColor: convertColor(p.backgroundColor) }, },
                '&[data-hovered]': {},
            },
        })}
        {...p}
        {...p.customProps}
        {...formHook.getInputProps(formField)}
    />
})