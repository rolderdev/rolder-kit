import { forwardRef, useState } from "react"
import { useShallowEffect } from "@mantine/hooks"
import { SegmentedControl } from "@mantine/core"
import converForSelectInputs from '../../../../../../../utils/converForSelectInputs/v0.2.0/converForSelectInputs'
import { useMolecule } from "bunshi/react"
import { FormHookMolecule } from "../../../../../../molecules/form/fabricVersions/v0.1.0/v0.4.0/useForm"
import { useAtomValue } from "jotai"
import { getValue8 } from "@rk/utils"
import { sendOutput, sendSignal } from "@rk/node-fabrik"

export default forwardRef(function (props: any) {
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
            const selectedItem = props.inputItems.find((i: any) => value && [i.value, i.id, i.label].includes(value))
            sendOutput(props.noodlNode, 'selectedItem', selectedItem || null)
            sendSignal(props.noodlNode, 'selected')
            if (!value) sendSignal(props.noodlNode, 'reseted')
        }
    }, [formHook?.values?.[props.formField]])

    return (
        <SegmentedControl
            orientation={props.segmentedControlOrientation}
            data={data}
            {...props}
            {...props.customProps}
            {...formHook.getInputProps(props.formField)}
        />
    )
})