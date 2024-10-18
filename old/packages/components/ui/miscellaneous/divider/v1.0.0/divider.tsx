import { Divider } from '@mantine/core'
import { getCompProps } from '@packages/get-comp-props'
import { forwardRef } from 'react'
import type { Props } from './types'

export default forwardRef((props: Props) => {
	const p = { ...getCompProps(props) } as Props

	return (
		<Divider
			variant={p.dividerVariant}
			orientation={p.dividerOrientation}
			labelPosition={p.dividerLabelPosition}
			{...p}
			{...p.customProps}
		>
			{props.children}
		</Divider>
	)
})
