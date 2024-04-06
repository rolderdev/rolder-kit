import { Indicator } from "@mantine/core"
import { forwardRef, useEffect, useImperativeHandle } from "react"
import { Props } from "../types"
import React from "react"
import { sendOutput, sendSignal } from '@packages/port-send'
import { useFormScope } from "@packages/scope"
import convertColor from "@packages/convert-color"
import { DateTimePicker } from "@mantine/dates"

export default forwardRef(function (props: Props, ref) {
    const { dayjs } = R.libs
    const Icon = props.iconName && R.libs.icons[props.iconName]
    const formHook = useFormScope()

    const value = formHook?.values?.[props.formField]

    useEffect(() => {
        sendOutput(props.noodlNode, 'selectedDate', value)
        sendSignal(props.noodlNode, 'selected')
    }, [value])

    useImperativeHandle(ref, () => ({ reset() { formHook?.setFieldValue(props.formField, null) } }), [])

    return <DateTimePicker
        icon={Icon
            ? <Icon size={props.iconSize} stroke={props.iconStroke} color={convertColor(props.iconColor)} />
            : <R.libs.icons.IconCalendar size="1.25rem" stroke={1.5} />
        }
        minDate={props.limitMinDate && dayjs ? dayjs().add(props.minDateOffset || 0, 'day').toDate() : undefined}
        renderDay={(date) => {
            const day = date.getDate()
            return <Indicator size={6} color="blue" offset={-5} disabled={dayjs?.(date).dayOfYear() !== dayjs?.().dayOfYear()}>
                <div>{day}</div>
            </Indicator>
        }}
        {...props}
        {...props.customProps}
        {...formHook?.getInputProps(props.formField)}
    />
})