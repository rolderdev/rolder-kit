import { Textarea } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { sendOutput, sendSignal } from '@packages/port-send'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import type { Props } from '../types'

export default forwardRef((props: Props, ref) => {
	const [value, setValue] = useState<string | number>('')
	const typingDelay = props.debouncedTyping ? props.typingDelay || 350 : 0
	const [debouncedTyping] = useDebouncedValue(value, typingDelay)
	useEffect(() => sendOutput(props.noodlNode, 'typedValue', debouncedTyping), [debouncedTyping])

	useEffect(() => {
		if (props.inputValue) {
			setValue(props.inputValue)
			sendOutput(props.noodlNode, 'typedValue', props.inputValue)
		}
	}, [props.inputValue])

	useImperativeHandle(
		ref,
		() => ({
			reset() {
				setValue('')
				sendOutput(props.noodlNode, 'typedValue', '')
				sendSignal(props.noodlNode, 'reseted')
			},
		}),
		[]
	)

	return (
		<Textarea
			value={value}
			error={props.inputError || false}
			onChange={(e) => {
				setValue(e.target.value)
				if (e.target.value?.length === 0) {
					sendOutput(props.noodlNode, 'typedValue', '')
					sendSignal(props.noodlNode, 'reseted')
				}
			}}
			{...props}
			{...props.customProps}
		/>
	)
})
