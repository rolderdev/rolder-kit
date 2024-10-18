import { Box, Tooltip } from '@mantine/core'
import { forwardRef } from 'react'
import type { Props } from '../node/definition'

export default forwardRef((p: Props) => {
	const resultProps = {
		events: { hover: p.hoverEvent, focus: p.focusEvent, touch: p.touchEvent },
		...p,
		...p.customProps,
	}

	// Tooltip поддерживает только одного ребенка и ему нужен ref. Обернем в Box, это удовлетворит оба требования.
	return p.floating ? (
		<Tooltip.Floating {...resultProps} offset={p.numberOffset}>
			<Box>{p.children}</Box>
		</Tooltip.Floating>
	) : (
		<Tooltip {...resultProps} offset={p.useCustomOffset ? p.customOffset : p.numberOffset}>
			<Box>{p.children}</Box>
		</Tooltip>
	)
})
