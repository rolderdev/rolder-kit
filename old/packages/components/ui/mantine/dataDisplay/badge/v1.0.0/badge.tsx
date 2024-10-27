import { Badge } from '@mantine/core'
import { getCompProps } from '@packages/get-comp-props'
import { useTableCellScope } from '@packages/scope'
import { forwardRef } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props) => {
	const item = useTableCellScope()

	const p = { ...getCompProps(props, item) } as Props

	return (
		<Badge variant={p.badgeVariant} {...p} {...p.customProps}>
			{p.label}
		</Badge>
	)
})
