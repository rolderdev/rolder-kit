import { Checkbox, type CheckboxProps } from '@mantine/core'
import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0'
import { forwardRef, useEffect, useState } from 'react'
import type { Props } from '../node/definition'

export default forwardRef((p: Props) => {
	const Icon: CheckboxProps['icon'] = ({ indeterminate, ...others }) => {
		const Icon = indeterminate ? R.libs.icons[p.customIcons.indeterminate] : R.libs.icons[p.customIcons.checked]

		return Icon ? <Icon {...others} /> : undefined
	}

	const [checked, setChecked] = useState(p.checkedProp)
	const [indeterminate, setIndeterminate] = useState(p.indeterminateProp)

	useEffect(() => {
		if (p.checkedProp !== checked) setChecked(p.checkedProp)
		if (p.indeterminateProp !== indeterminate) setIndeterminate(p.indeterminateProp)
	}, [p.checkedProp, p.indeterminateProp])

	useEffect(() => {
		sendOutput(p.noodlNode, 'checked', checked)
		sendOutput(p.noodlNode, 'indeterminate', indeterminate)
		sendSignal(p.noodlNode, 'changed')
	}, [checked, indeterminate])

	return (
		<Checkbox
			checked={p.inGroup ? undefined : checked}
			indeterminate={p.inGroup ? undefined : indeterminate}
			onChange={p.inGroup ? undefined : (event) => setChecked(event.currentTarget.checked)}
			icon={p.customIcons ? Icon : undefined}
			{...p}
			{...p.customProps}
		/>
	)
})
