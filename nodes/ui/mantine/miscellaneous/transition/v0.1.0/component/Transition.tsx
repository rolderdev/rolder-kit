import { Box, Transition } from '@mantine/core'
import { sendSignal } from '@shared/port-send-v1.0.0'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import type { Props } from '../node/definition'

export default forwardRef((p: Props, ref) => {
	const [mounted, setMounted] = useState(false)

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (p.automount) setMounted(true)
	}, [])

	useImperativeHandle(
		ref,
		() => ({
			mount: () => !mounted && setMounted(true),
			unmount: () => mounted && setMounted(false),
		}),
		[mounted]
	)

	return (
		<Transition
			mounted={mounted}
			onEntered={() => sendSignal(p.noodlNode, 'transitionEntered')}
			onExited={() => sendSignal(p.noodlNode, 'transitionExited')}
			{...p}
			{...p.customProps}
		>
			{(styles) => (
				<Box style={styles} {...p.customProps}>
					{p.children}
				</Box>
			)}
		</Transition>
	)
})
