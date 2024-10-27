import { CheckboxIndicator, type CheckboxProps } from '@mantine/core'
import { forwardRef } from 'react'
import type { Props } from '../node/definition'

export default forwardRef((p: Props) => {
	const Icon: CheckboxProps['icon'] = ({ indeterminate, ...others }) => {
		const Icon = indeterminate ? R.libs.icons[p.customIcons.indeterminate] : R.libs.icons[p.customIcons.checked]

		return Icon ? <Icon {...others} /> : undefined
	}

	// Нужно убирать значение с порта, когда в CheckboxCard, иначе он не может управлять состоянием.
	return (
		<CheckboxIndicator
			checked={p.inCard ? undefined : p.checkedProp}
			indeterminate={p.inCard ? undefined : p.indeterminateProp}
			icon={p.customIcons ? Icon : undefined}
			{...p}
			{...p.customProps}
		/>
	)
})
