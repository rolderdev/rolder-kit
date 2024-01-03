import { forwardRef, useImperativeHandle } from "react"
import { Indicator } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { IconCalendar } from "@tabler/icons-react"
import icons from "../../../../../../../libs/icons/v0.2.0/icons"
import { useShallowEffect } from "@mantine/hooks"
import { useMolecule } from "bunshi/react"
import { FormHookMolecule } from "../../../../../../molecules/form/fabricVersions/v0.1.0/v0.4.0/useForm"
import { useAtomValue } from "jotai"
import { sendOutput, sendSignal } from "@rk/node-fabrik"
import { dayjs } from "@rk/libs"

export default forwardRef(function (props: any, ref) {
    const Icon = icons(props.iconName)

    const { formHookAtom } = useMolecule(FormHookMolecule)
    const formHook = useAtomValue(formHookAtom)

    useShallowEffect(() => {
        const value = formHook?.values?.[props.formField]
        if (value) {
            let dates: Date[] = []
            if (Array.isArray(value)) dates = value
            else dates = [value]
            sendSignal(props.noodlNode, 'selected')
            sendOutput(props.noodlNode, 'selectedDates', dates || null)
        } if (!value) sendSignal(props.noodlNode, 'reseted')
    }, [formHook?.values?.[props.formField]])

    // reset
    useImperativeHandle(ref, () => ({ resetSelected() { formHook?.setFieldValue(props.formField, null) } }), [])

    return <DatePickerInput
        renderDay={(date) => {
            const day = date.getDate()
            return <Indicator size={6} color="blue" offset={-5} disabled={dayjs(date).dayOfYear() !== dayjs().dayOfYear()}>
                <div>{day}</div>
            </Indicator>
        }}
        icon={(Icon && <Icon size={props.iconSize} stroke={props.stroke} />) || <IconCalendar size="1.25rem" stroke={1.5} />}
        valueFormat={props.dateFormatAtDatePicker}
        type={props.datePickerType}
        minDate={props.limitMinDate && dayjs().add(props.minDateOffset, 'day').toDate()}
        {...props}
        {...props.customProps}
        {...formHook?.getInputProps(props.formField)}
    />
})