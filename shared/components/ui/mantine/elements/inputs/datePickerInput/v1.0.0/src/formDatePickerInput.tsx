import { Indicator } from "@mantine/core"
import { forwardRef, useEffect, useImperativeHandle } from "react"
import { Props } from "../types"
import React from "react"
import { sendOutput, sendSignal } from '@shared/port-send'
import { useFormScope } from "@shared/scope"
import convertColor from "@shared/convert-color"
import { DatePickerInput } from "@mantine/dates"
import { isEmpty } from "../datePickerInput"

export default forwardRef(function (props: Props, ref) {
    const { dayjs } = R.libs
    const Icon = props.iconName && R.libs.icons[props.iconName]
    const formHook = useFormScope()

    const value = formHook?.values?.[props.formField]

    useEffect(() => {
        //@ts-ignore
        sendOutput(props.noodlNode, 'dateValue', value)
        sendSignal(props.noodlNode, 'changed')
        if (isEmpty(value)) sendSignal(props.noodlNode, 'reseted')
    }, [value])

    useImperativeHandle(ref, () => ({ reset() { formHook?.setFieldValue(props.formField, null) } }), [])

    return <DatePickerInput
        icon={Icon
            ? <Icon size={props.iconSize} stroke={props.iconStroke} color={convertColor(props.iconColor)} />
            : <R.libs.icons.IconCalendar size="1.25rem" stroke={1.5} />
        }
        type={props.datePickerType}
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