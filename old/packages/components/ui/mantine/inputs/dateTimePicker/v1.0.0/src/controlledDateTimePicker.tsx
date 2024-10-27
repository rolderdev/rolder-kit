import { Indicator } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import convertColor from '@packages/convert-color'
import { sendOutput, sendSignal } from '@packages/port-send'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import type { Props } from '../types'

export default forwardRef((props: Props, ref) => {
	const { dayjs } = R.libs
	const Icon = props.iconName && R.libs.icons[props.iconName]

	const [value, setValue] = useState<Date | null>(null)
	useEffect(() => {
		sendOutput(props.noodlNode, 'selectedDate', value)
		sendSignal(props.noodlNode, 'selected')
	}, [value])

	useEffect(() => setValue(props.defaultDate || null), [props.defaultDate])
	useImperativeHandle(
		ref,
		() => ({
			reset() {
				setValue(null)
			},
		}),
		[]
	)

	return (
		<DateTimePicker
			value={value}
			error={props.inputError || false}
			icon={
				Icon ? (
					<Icon size={props.iconSize} stroke={props.iconStroke} color={convertColor(props.iconColor)} />
				) : (
					<R.libs.icons.IconCalendar size="1.25rem" stroke={1.5} />
				)
			}
			minDate={
				props.limitMinDate && dayjs
					? dayjs()
							.add(props.minDateOffset || 0, 'day')
							.toDate()
					: undefined
			}
			onChange={setValue}
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
