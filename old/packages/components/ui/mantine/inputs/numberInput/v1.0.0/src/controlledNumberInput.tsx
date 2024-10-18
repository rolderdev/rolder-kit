import { NumberInput, type NumberInputHandlers } from '@mantine/core'
import convertColor from '@packages/convert-color'
import isEmpty from '@packages/is-empty'
import { sendOutput, sendSignal } from '@packages/port-send'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { Props } from '../types'

export default forwardRef((props: Props, ref) => {
	const Icon = props.iconName && R.libs.icons[props.iconName]

	const [value, setValue] = useState<number | ''>('')
	const handlers = useRef<NumberInputHandlers>()

	useEffect(() => {
		sendOutput(props.noodlNode, 'value', value)
		if (value === '') sendSignal(props.noodlNode, 'reseted')
		else sendSignal(props.noodlNode, 'changed')
	}, [value])

	useEffect(() => {
		if (isEmpty(props.defaultNumberValue)) setValue('')
		else setValue(props.defaultNumberValue)
	}, [props.defaultNumberValue])

	useImperativeHandle(
		ref,
		() => ({
			reset() {
				setValue(props.defaultNumberValue || 0)
				sendOutput(props.noodlNode, 'value', props.defaultNumberValue || 0)
			},
			increment() {
				handlers.current?.increment()
			},
			decrement() {
				handlers.current?.decrement()
			},
		}),
		[]
	)

	return (
		<NumberInput
			value={value}
			variant={props.numberInputVariant}
			icon={Icon && <Icon size={props.iconSize} stroke={props.iconStroke} color={convertColor(props.iconColor)} />}
			error={props.inputError || false}
			onChange={setValue}
			handlersRef={handlers}
			{...props}
			{...props.customProps}
		/>
	)
})
