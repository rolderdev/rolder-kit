import { getCompProps } from '@packages/get-comp-props'
import { forwardRef, lazy, useImperativeHandle, useRef } from 'react'
import type { Props } from './types'

const FormCheckboxGroup = lazy(() => import('./src/formCheckboxGroup'))
const ControlledCheckboxGroup = lazy(() => import('./src/controlledCheckboxGroup'))

export default forwardRef((props: Props, ref) => {
	const localRef = useRef<any>(null)
	useImperativeHandle(
		ref,
		() => ({
			resetSelected() {
				localRef.current?.resetSelected()
			},
		}),
		[]
	)

	const p = { ...getCompProps(props) } as Props

	return props.useScope ? (
		<FormCheckboxGroup {...p} {...p.customProps} ref={localRef} />
	) : (
		<ControlledCheckboxGroup {...p} {...p.customProps} ref={localRef} />
	)
})
