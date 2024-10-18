import { CheckIcon, Radio } from '@mantine/core'
import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0'
import { forwardRef, useEffect, useState } from 'react'
import type { Props } from '../node/definition'

export default forwardRef((p: Props) => {
	const [checked, setChecked] = useState(p.checkedProp)

	useEffect(() => {
		if (p.checkedProp !== checked) setChecked(p.checkedProp)
	}, [p.checkedProp])

	useEffect(() => {
		sendOutput(p.noodlNode, 'checked', checked)
		sendSignal(p.noodlNode, 'changed')
	}, [checked])

	return (
		<Radio
			checked={p.inGroup ? undefined : checked}
			onChange={p.inGroup ? undefined : (event) => setChecked(event.currentTarget.checked)}
			icon={p.checkIcon ? CheckIcon : undefined}
			{...p}
			{...p.customProps}
		/>
	)
})
