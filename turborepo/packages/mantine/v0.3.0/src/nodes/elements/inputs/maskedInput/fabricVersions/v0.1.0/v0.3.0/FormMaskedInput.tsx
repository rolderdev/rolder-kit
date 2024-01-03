import { forwardRef } from "react"
import icons from "../../../../../../../libs/icons/v0.2.0/icons"
import { useId } from "@mantine/hooks"
import { CloseButton, Input } from "@mantine/core"
import { useMolecule } from "bunshi/react"
import { FormHookMolecule } from "../../../../../../molecules/form/fabricVersions/v0.1.0/v0.4.0/useForm"
import { useAtomValue } from "jotai"
import { IMaskInput } from 'react-imask'
import debounce from 'just-debounce-it'
import { sendOutput, sendSignal } from "@rk/node-fabrik"

export default forwardRef(function (props: any) {
    const { formField } = props

    const id = useId()
    const Icon = icons(props.iconName)

    const { formHookAtom } = useMolecule(FormHookMolecule)
    const formHook = useAtomValue(formHookAtom)

    function setValue(value: string | number) {
        const parsedValue = value === 0 ? '' : value
        formHook.setFieldValue(formField, parsedValue)
        formHook.setFieldValue(formField, parsedValue)

        const typingDelay = props.debouncedTyping ? props.typingDelay : 0
        const debouncedType = debounce(() => {
            sendOutput(props.noodlNode, 'typedValue', parsedValue)
        }, typingDelay)
        debouncedType()

        const validationDelay = props.debouncedValidation ? props.validationDelay : 0
        const debouncedValidation = debounce(() => {
            if (props.validationType === 'onChange') formHook.validateField(formField)
        }, validationDelay)
        debouncedValidation()
    }

    let maskProps = {}
    switch (props.maskType) {
        case 'number': maskProps = {
            mask: Number,
            scale: props.numberScale,
            thousandsSeparator: props.thousandsSeparator,
            radix: props.radix,
            mapToRadix: ['.', ','],
        }; break
        default: maskProps = {
            mask: props.maskPattern,
            lazy: props.hideMaskPattern,
            overwrite: props.overwriteMaskPattern
        }
    }

    return <Input.Wrapper
        id={id}
        label={props.label}
        withAsterisk={props.withAsterisk}
        error={formHook?.errors[formField]}
    >
        <Input<any>
            id={id}
            component={IMaskInput}
            unmask='typed'
            value={formHook?.values[formField]}
            error={formHook?.errors[formField]}
            onAccept={setValue}
            onBlurCapture={() => { if (props.validationType === 'onBlur') formHook.validateField(formField) }}
            icon={Icon && <Icon size={props.iconSize} stroke={props.stroke} />}
            rightSection={<CloseButton onClick={() => {
                formHook?.setFieldValue(props.formField, '')
                setValue('')
                sendSignal(props.noodlNode, 'reseted')
            }} />}
            {...props}
            {...maskProps}
            {...props.customProps}
        />
    </Input.Wrapper>
})