import { CloseButton, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import convertColor from '@packages/convert-color'
import { sendOutput, sendSignal } from '@packages/port-send'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import React from 'react'
import type { Props } from '../types'

export default forwardRef((props: Props, ref) => {
	const Icon = props.iconName && R.libs.icons[props.iconName]

	const [value, setValue] = useState<string | number>('')
	const typingDelay = props.debouncedTyping ? props.typingDelay || 350 : 0
	const [debouncedTyping] = useDebouncedValue(value, typingDelay)
	useEffect(() => {
		sendOutput(props.noodlNode, 'typedValue', debouncedTyping)
		sendSignal(props.noodlNode, 'changed')
	}, [debouncedTyping])

	useEffect(() => {
		if (props.inputValue) {
			setValue(props.inputValue)
			sendOutput(props.noodlNode, 'typedValue', props.inputValue)
			sendSignal(props.noodlNode, 'changed')
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
		<TextInput
			value={value}
			error={props.inputError || false}
			icon={Icon && <Icon size={props.iconSize} stroke={props.iconStroke} color={convertColor(props.iconColor)} />}
			rightSection={
				<CloseButton
					tabIndex={props.focusRightSection ? 0 : -1}
					onClick={() => {
						setValue('')
						sendOutput(props.noodlNode, 'typedValue', '')
						sendSignal(props.noodlNode, 'reseted')
					}}
				/>
			}
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
