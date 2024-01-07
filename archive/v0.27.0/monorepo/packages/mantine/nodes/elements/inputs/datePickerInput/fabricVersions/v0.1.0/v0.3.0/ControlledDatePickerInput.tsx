import { forwardRef, useImperativeHandle, useState } from "react"
import { Indicator } from "@mantine/core"
import { DatePickerInput, DateValue, DatesRangeValue } from "@mantine/dates"
import { IconCalendar } from "@tabler/icons-react"
import icons from "../../../../../../../libs/icons/v0.2.0/icons"
import { sendOutput, sendSignal } from "../../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { CompProps } from "./types"
import getCompProps from "../../../../../../../../../libs/nodesFabric/v0.1.0/getCompProps/v0.1.0/getCompProps"
import { useShallowEffect } from "@mantine/hooks"

function isEmpty(dateValue: any) {
    if (!dateValue) return true
    if (Array.isArray(dateValue)) {
        if (!dateValue.length) return true
        else if (dateValue.filter(i => i === null).length === 2) return true
    }
    return false
}

export default forwardRef(function (props: CompProps, ref) {
    const { dayjs } = window.R.libs

    const p = { ...getCompProps(props) } as CompProps
    const { noodlNode, iconName } = p

    const Icon = iconName && icons(iconName)

    const [dateValue, setDateValue] = useState<DatesRangeValue | DateValue | Date[] | undefined>(undefined)
    useShallowEffect(() => { setDateValue(p.dateValue) }, [p.dateValue])

    // reset
    useImperativeHandle(ref, () => ({ reset() { setDateValue(undefined) } }), [])

    return <DatePickerInput
        value={isEmpty(dateValue) ? [] : dateValue}
        onChange={(value) => {
            sendOutput(noodlNode, 'dateValue', value)
            sendSignal(noodlNode, 'changed')
            setDateValue(value)
            if (isEmpty(value)) sendSignal(noodlNode, 'reseted')
        }}
        error={p.inputError || false}
        renderDay={(date) => {
            const day = date.getDate()
            return <Indicator size={6} color="blue" offset={-5} disabled={dayjs(date).dayOfYear() !== dayjs().dayOfYear()}>
                <div>{day}</div>
            </Indicator>
        }}
        icon={(Icon && <Icon size={p.iconSize} stroke={p.stroke} />) || <IconCalendar size="1.25rem" stroke={1.5} />}
        type={p.datePickerType}
        valueFormat={p.dateFormatAtDatePicker || 'YYYY-MM-DD'}
        minDate={p.limitMinDate && p.minDateOffset ? dayjs().add(p.minDateOffset || 0, 'day').toDate() : undefined}
        {...p}
        {...p.customProps}
    />
})