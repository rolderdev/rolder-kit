import { Group } from '@mantine/core'
import { getCompProps } from '@packages/get-comp-props'
import { forwardRef } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props) => {
	const p = { ...getCompProps(props) } as Props

	return (
		<Group position={p.groupPosition} spacing={p.groupSpacing} {...p} {...p.customProps}>
			{props.children}
		</Group>
	)
})
