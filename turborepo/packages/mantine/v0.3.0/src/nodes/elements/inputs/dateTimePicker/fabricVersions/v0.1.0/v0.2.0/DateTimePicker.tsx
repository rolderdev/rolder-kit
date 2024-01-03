import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Indicator } from "@mantine/core"
import { DateTimePicker } from "@mantine/dates"
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
    const [value, setValue] = useState<Date | null>(null);
    useEffect(() => {
        sendOutput(props.noodlNode, 'selectedDate', value)
        sendSignal(props.noodlNode, 'selected')
    }, [value])

    // controlled
    useShallowEffect(() => {
        if (props.defaultDate) {
            formHook?.setFieldValue(props.formField, props.defaultDate)
            setValue(props.defaultDate)
        }
    }, [props.defaultDate])

    // reset
    useImperativeHandle(ref, () => ({
        resetSelected() {
            formHook?.setFieldValue(props.formField, null)
            setValue(null)
        }
    }), [])

    return <DateTimePicker
        value={props.useForm ? formHook?.values?.[props.formField] : value}
        onChange={(value) => {
            formHook?.setFieldValue(props.formField, value)
            setValue(value)
        }}
        error={formHook?.errors?.[props.formField]}
        renderDay={(date) => {
            const day = date.getDate()
            return <Indicator size={6} color="blue" offset={-5} disabled={dayjs(date).dayOfYear() !== dayjs().dayOfYear()}>
                <div>{day}</div>
            </Indicator>
        }}
        icon={(Icon && <Icon size={props.iconSize} stroke={props.stroke} />) || <IconCalendar size="1.25rem" stroke={1.5} />}
        valueFormat={props.dateFormatAtDateTimePicker}
        minDate={props.limitMinDate && dayjs().add(props.minDateOffset, 'day').toDate()}
        {...props}
        {...props.customProps}
    />
})