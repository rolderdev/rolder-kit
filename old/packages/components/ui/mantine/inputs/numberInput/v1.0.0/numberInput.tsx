import { getCompProps } from '@packages/get-comp-props'
import { forwardRef, lazy, useImperativeHandle, useRef } from 'react'
import type { Props } from './types'

const FormNumberInput = lazy(() => import('./src/formNumberInput'))
const ControlledNumberInput = lazy(() => import('./src/controlledNumberInput'))

export default forwardRef((props: Props, ref) => {
	const selectRef = useRef<any>(null)
	useImperativeHandle(
		ref,
		() => ({
			reset() {
				selectRef.current?.reset()
			},
			increment() {
				selectRef.current?.increment()
			},
			decrement() {
				selectRef.current?.decrement()
			},
		}),
		[]
	)

	const p = { ...getCompProps(props) } as Props

	return props.useScope ? (
		<FormNumberInput {...p} {...p.customProps} ref={selectRef} />
	) : (
		<ControlledNumberInput {...p} {...p.customProps} ref={selectRef} />
	)
})
