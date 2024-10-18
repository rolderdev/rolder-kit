import { getCompProps } from '@packages/get-comp-props'
import { forwardRef, lazy, useImperativeHandle, useRef } from 'react'
import type { Props } from './types'

const FormTextarea = lazy(() => import('./src/formTextarea'))
const ControlledTextarea = lazy(() => import('./src/controlledTextarea'))

export default forwardRef((props: Props, ref) => {
	const selectRef = useRef<any>(null)
	useImperativeHandle(
		ref,
		() => ({
			reset() {
				selectRef.current?.reset()
			},
		}),
		[]
	)

	const p = { ...getCompProps(props) } as Props

	return props.useScope ? (
		<FormTextarea {...p} {...p.customProps} ref={selectRef} />
	) : (
		<ControlledTextarea {...p} {...p.customProps} ref={selectRef} />
	)
})
