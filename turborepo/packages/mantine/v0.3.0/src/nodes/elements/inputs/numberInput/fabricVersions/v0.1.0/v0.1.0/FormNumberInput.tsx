import { forwardRef, useImperativeHandle, useRef } from "react"
import icons from "../../../../../../../libs/icons/v0.2.0/icons"
import { NumberInput, NumberInputHandlers } from "@mantine/core"
import { useMolecule } from "bunshi/react"
import { FormHookMolecule } from "../../../../../../molecules/form/fabricVersions/v0.1.0/v0.4.0/useForm"
import { useAtomValue } from "jotai"
import { sendOutput } from "@rk/node-fabrik"

export default forwardRef(function (props: any, ref) {
    const Icon = icons(props.iconName)

    const { formHookAtom } = useMolecule(FormHookMolecule)
    const formHook = useAtomValue(formHookAtom)
    const handlers = useRef<NumberInputHandlers>()
    // reset
    useImperativeHandle(ref, () => ({
        reset() {
            formHook?.setFieldValue(props.formField, props.defaultNumberValue || 0)
            sendOutput(props.noodlNode, 'value', props.defaultNumberValue || 0)
        },
        increment() { handlers.current?.increment() },
        decrement() { handlers.current?.decrement() }
    }), [])

    return (
        <NumberInput
            value={formHook?.values?.[props.formField]}
            variant={props.numberInputVariant}
            icon={Icon && <Icon size={props.iconSize} stroke={props.stroke} />}
            error={formHook?.errors?.[props.formField]}
            onChange={(e) => {
                formHook?.setFieldValue(props.formField, e)
                sendOutput(props.noodlNode, 'value', e)
            }}
            handlersRef={handlers}
            {...props}
            {...props.customProps}
        />
    )
})