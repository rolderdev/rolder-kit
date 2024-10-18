import { Checkbox } from '@mantine/core'
import convertColor from '@packages/convert-color'
import { sendOutput, sendSignal } from '@packages/port-send'
import { useFormScope } from '@packages/scope'
import { forwardRef, useEffect, useImperativeHandle } from 'react'
import type { Props } from '../types'

export default forwardRef((props: Props, ref) => {
	const Icon = props.iconName && R.libs.icons[props.iconName]
	const formHook = useFormScope()

	const value = formHook?.values?.[props.formField]
	useEffect(() => {
		sendOutput(props.noodlNode, 'checked', value)
		sendSignal(props.noodlNode, 'changed')
	}, [value])

	useImperativeHandle(
		ref,
		() => ({
			reset() {
				formHook?.setFieldValue(props.formField, false)
				sendOutput(props.noodlNode, 'checked', false)
			},
		}),
		[]
	)

	return (
		<Checkbox
			icon={Icon && <Icon size={props.iconSize} stroke={props.iconStroke} color={convertColor(props.iconColor)} />}
			{...props}
			{...props.customProps}
			{...formHook?.getInputProps(props.formField, { type: 'checkbox' })}
		/>
	)
})
