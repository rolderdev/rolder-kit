import { forwardRef, useImperativeHandle, useState } from "react"
import icons from "../../../../../../../libs/icons/v0.2.0/icons"
import { useShallowEffect } from "@mantine/hooks"
import { sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { Checkbox } from "@mantine/core"
import { useMolecule } from "bunshi/react"
import { FormHookMolecule } from "../../../../../../molecules/form/fabricVersions/v0.1.0/v0.4.0/useForm"
import { useAtomValue } from "jotai"

export default forwardRef(function (props: any, ref) {
    const { getValue } = window.R.utils
    const Icon = icons(props.iconName)

    const [label, setLabel] = useState('')
    useShallowEffect(() => {
        const label = getValue.v8(props.item, props.labelField)
        if (label) setLabel(label)
    }, [props])

    const { formHookAtom } = useMolecule(FormHookMolecule)
    const formHook = useAtomValue(formHookAtom)

    // reset
    useImperativeHandle(ref, () => ({ reset() { formHook?.setFieldValue(props.formField, false) } }), [])

    return (
        <Checkbox
            label={label}
            error={props.inputError || false}
            icon={Icon && <Icon size={props.iconSize} stroke={props.stroke} />}
            checked={formHook?.values?.[props.formField]}
            onChange={(event) => {
                formHook?.setFieldValue(props.formField, event.currentTarget.checked)
                sendSignal(props.noodlNode, 'selected')
            }}
            {...props}
            {...props.customProps}
            {...formHook.getInputProps(props.formField)}
        />
    )
})