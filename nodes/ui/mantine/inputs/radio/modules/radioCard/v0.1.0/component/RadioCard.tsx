import { RadioCard } from '@mantine/core'
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
		<RadioCard
			checked={p.inGroup ? undefined : checked}
			onClick={p.inGroup ? undefined : () => setChecked((c) => !c)}
			{...p}
			{...p.customProps}
		>
			{p.children}
		</RadioCard>
	)
})
