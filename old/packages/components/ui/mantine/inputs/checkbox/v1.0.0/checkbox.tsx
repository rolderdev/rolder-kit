import { getCompProps } from '@packages/get-comp-props'
import { forwardRef, lazy, useImperativeHandle, useRef } from 'react'
import type { Props } from './types'

const FormCheckbox = lazy(() => import('./src/formCheckbox'))
const ControlledCheckbox = lazy(() => import('./src/controlledCheckbox'))

export default forwardRef((props: Props, ref) => {
	const localRef = useRef<any>(null)
	useImperativeHandle(
		ref,
		() => ({
			reset() {
				localRef.current?.reset()
			},
		}),
		[]
	)

	const p = { ...getCompProps(props) } as Props

	return props.useScope ? (
		<FormCheckbox {...p} {...p.customProps} ref={localRef} />
	) : (
		<ControlledCheckbox {...p} {...p.customProps} ref={localRef} />
	)
})
