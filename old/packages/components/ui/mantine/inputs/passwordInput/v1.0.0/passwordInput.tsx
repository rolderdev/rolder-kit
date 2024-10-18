import { getCompProps } from '@packages/get-comp-props'
import { forwardRef, lazy, useImperativeHandle, useRef } from 'react'
import type { Props } from './types'

const FormPasswordInput = lazy(() => import('./src/formPasswordInput'))
const ControlledPasswordInput = lazy(() => import('./src/controlledPasswordInput'))

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
		<FormPasswordInput {...p} {...p.customProps} ref={selectRef} />
	) : (
		<ControlledPasswordInput {...p} {...p.customProps} ref={selectRef} />
	)
})
