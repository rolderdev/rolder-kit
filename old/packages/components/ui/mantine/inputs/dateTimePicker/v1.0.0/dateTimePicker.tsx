import { getCompProps } from '@packages/get-comp-props'
import { forwardRef, lazy, useImperativeHandle, useRef } from 'react'
import type { Props } from './types'

const FormDateTimePicker = lazy(() => import('./src/formDateTimePicker'))
const ControlledDateTimePicker = lazy(() => import('./src/controlledDateTimePicker'))

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
		<FormDateTimePicker {...p} {...p.customProps} ref={selectRef} />
	) : (
		<ControlledDateTimePicker {...p} {...p.customProps} ref={selectRef} />
	)
})
