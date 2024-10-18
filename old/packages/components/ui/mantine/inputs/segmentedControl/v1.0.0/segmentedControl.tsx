import { getCompProps } from '@packages/get-comp-props'
import { forwardRef, lazy } from 'react'
import type { Props } from './types'

const FormSegmentedControl = lazy(() => import('./src/formSegmentedControl'))
const ControlledSegmentedControl = lazy(() => import('./src/controlledSegmentedControl'))

export default forwardRef((props: Props, ref) => {
	const p = { ...getCompProps(props) } as Props

	return props.useScope ? (
		<FormSegmentedControl {...p} {...p.customProps} />
	) : (
		<ControlledSegmentedControl {...p} {...p.customProps} />
	)
})
