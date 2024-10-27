import { Indicator } from '@mantine/core'
import { DatePickerInput, type DateValue, type DatesRangeValue } from '@mantine/dates'
import convertColor from '@packages/convert-color'
import { sendOutput, sendSignal } from '@packages/port-send'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { isEmpty } from '../datePickerInput'
import type { Props } from '../types'

export default forwardRef((props: Props, ref) => {
	const { dayjs } = R.libs
	const Icon = props.iconName && R.libs.icons[props.iconName]

	const [dateValue, setDateValue] = useState<DatesRangeValue | DateValue | Date[] | undefined>(undefined)
	useEffect(() => {
		setDateValue(props.dateValue)
		//@ts-ignore
		sendOutput(props.noodlNode, 'dateValue', props.dateValue)
	}, [props.dateValue])
	useImperativeHandle(
		ref,
		() => ({
			reset() {
				setDateValue(undefined)
			},
		}),
		[]
	)

	return (
		<DatePickerInput
			value={dateValue}
			error={props.inputError || false}
			icon={
				Icon ? (
					<Icon size={props.iconSize} stroke={props.iconStroke} color={convertColor(props.iconColor)} />
				) : (
					<R.libs.icons.IconCalendar size="1.25rem" stroke={1.5} />
				)
			}
			type={props.datePickerType}
			minDate={
				props.limitMinDate && dayjs
					? dayjs()
							.add(props.minDateOffset || 0, 'day')
							.toDate()
					: undefined
			}
			onChange={(value) => {
				//@ts-ignore
				sendOutput(props.noodlNode, 'dateValue', value)
				sendSignal(props.noodlNode, 'changed')
				setDateValue(value)
				if (isEmpty(value)) sendSignal(props.noodlNode, 'reseted')
			}}
			renderDay={(date) => {
				const day = date.getDate()
				return (
					<Indicator size={6} color="blue" offset={-5} disabled={dayjs?.(date).dayOfYear() !== dayjs?.().dayOfYear()}>
						<div>{day}</div>
					</Indicator>
				)
			}}
			{...props}
			{...props.customProps}
		/>
	)
})
