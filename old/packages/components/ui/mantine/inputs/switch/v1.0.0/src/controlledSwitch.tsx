import { Switch } from '@mantine/core'
import { sendOutput, sendSignal } from '@packages/port-send'
import { forwardRef, useImperativeHandle, useState } from 'react'
import type { Props } from '../types'
//import convertColor from "@packages/convert-color"

export default forwardRef((props: Props, ref) => {
	//  const Icon = props.iconName && R.libs.icons[props.iconName]

	const [checked, setChecked] = useState(props.inputChecked)

	useImperativeHandle(
		ref,
		() => ({
			reset() {
				setChecked(false)
				sendOutput(props.noodlNode, 'checked', false)
			},
		}),
		[]
	)

	return (
		<Switch
			error={props.inputError || false}
			//icon={Icon && <Icon size={props.iconSize} stroke={props.iconStroke} color={convertColor(props.iconColor)} />}
			checked={checked}
			onChange={(e) => {
				setChecked(e.currentTarget.checked)
				sendOutput(props.noodlNode, 'checked', e.currentTarget.checked)
				sendSignal(props.noodlNode, 'changed')
			}}
			{...props}
			{...props.customProps}
		/>
	)
})
