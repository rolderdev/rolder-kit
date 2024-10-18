import { RadioGroup } from '@mantine/core'
import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0'
import { forwardRef, useEffect, useState } from 'react'
import type { Props } from '../node/definition'

export default forwardRef((p: Props) => {
	const [value, setValue] = useState<string | undefined>(p.defaultValue)

	useEffect(() => {
		sendOutput(p.noodlNode, 'selectedValue', value)
		sendOutput(p.noodlNode, 'selectedItem', p.items?.find((i) => R.libs.just.get(i, p.valuePath) === value) || null)
		sendSignal(p.noodlNode, 'changed')
	}, [value])

	return (
		<RadioGroup onChange={setValue} {...p} {...p.customProps}>
			{p.children}
		</RadioGroup>
	)
})
