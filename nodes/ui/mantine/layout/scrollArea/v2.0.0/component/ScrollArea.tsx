import { ScrollArea } from '@mantine/core'
import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { Props } from '../node/definition'

export default forwardRef((p: Props, ref) => {
	const viewport = useRef<HTMLDivElement>(null)

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (viewport.current?.scrollHeight) sendOutput(p.noodlNode, 'scrollHeight', viewport.current?.scrollHeight)
	}, [viewport.current?.scrollHeight, p.children])

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useImperativeHandle(
		ref,
		() => ({
			scrollToTop: () => viewport.current?.scrollTo({ top: 0, behavior: 'smooth' }),
			scrollToBottom: () => viewport.current?.scrollTo({ top: viewport.current?.scrollHeight, behavior: 'smooth' }),
			scrollToPosition: (p: Props) => viewport.current?.scrollTo({ top: p.toScrollPosition || 0, behavior: 'smooth' }),
			getScrollHeight: () => sendOutput(p.noodlNode, 'scrollHeight', viewport.current?.scrollHeight),
		}),
		[viewport]
	)

	if (!p.autosize)
		return (
			<ScrollArea
				viewportRef={viewport}
				onScrollPositionChange={(pos) => {
					sendOutput(p.noodlNode, 'scrollPosition', pos)
					p.noodlNode._internal.pos = pos
				}}
				onTopReached={() => sendSignal(p.noodlNode, 'topReached')}
				onBottomReached={() => sendSignal(p.noodlNode, 'bottomReached')}
				{...p}
				{...p.customProps}
			>
				{p.children}
			</ScrollArea>
		)

	return (
		<ScrollArea.Autosize
			viewportRef={viewport}
			onScrollPositionChange={(pos) => {
				sendOutput(p.noodlNode, 'scrollPosition', pos)
				p.noodlNode._internal.pos = pos
			}}
			onTopReached={() => sendSignal(p.noodlNode, 'topReached')}
			onBottomReached={() => sendSignal(p.noodlNode, 'bottomReached')}
			{...p}
			{...p.customProps}
		>
			{p.children}
		</ScrollArea.Autosize>
	)
})
