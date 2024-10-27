import { PasswordInput } from '@mantine/core'
import { sendOutput, sendSignal } from '@packages/port-send'
import { forwardRef, useImperativeHandle, useState } from 'react'
import type { Props } from '../types'

export default forwardRef((props: Props, ref) => {
	const [value, setValue] = useState<string | number>('')

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
		<PasswordInput
			value={value}
			error={props.inputError || false}
			onChange={(e) => {
				setValue(e.target.value)
				if (e.target.value?.length === 0) {
					sendOutput(props.noodlNode, 'typedValue', '')
					sendSignal(props.noodlNode, 'reseted')
				} else sendOutput(props.noodlNode, 'typedValue', e.target.value)
			}}
			toggleTabIndex={props.focusRightSection ? 0 : undefined}
			{...props}
			{...props.customProps}
		/>
	)
})
