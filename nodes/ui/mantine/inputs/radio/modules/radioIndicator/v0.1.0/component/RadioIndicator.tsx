import { RadioIndicator } from '@mantine/core'
import { forwardRef } from 'react'
import type { Props } from '../node/definition'

export default forwardRef((p: Props) => {
	// Нужно убирать значение с порта, когда в RadioCard, иначе он не может управлять состоянием.
	return <RadioIndicator checked={p.inCard ? undefined : p.checkedProp} {...p} {...p.customProps} />
})
