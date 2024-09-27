import { ScrollArea } from '@mantine/core';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { Props } from '../node/definition';
import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';

export default forwardRef(function (p: Props, ref) {
	const viewport = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (viewport.current?.scrollHeight) sendOutput(p.noodlNode, 'scrollHeight', viewport.current?.scrollHeight);
	}, [viewport.current?.scrollHeight, p.children]);

	useImperativeHandle(
		ref,
		() => ({
			scrollToTop: () => viewport.current!.scrollTo({ top: 0, behavior: 'smooth' }),
			scrollToBottom: () => viewport.current!.scrollTo({ top: viewport.current!.scrollHeight, behavior: 'smooth' }),
			scrollToPosition: (p: Props) => viewport.current!.scrollTo({ top: p.toScrollPosition || 0, behavior: 'smooth' }),
			getScrollHeight: () => sendOutput(p.noodlNode, 'scrollHeight', viewport.current?.scrollHeight),
		}),
		[viewport]
	);

	if (!p.autosize)
		return (
			<ScrollArea
				viewportRef={viewport}
				onScrollPositionChange={(pos) => {
					sendOutput(p.noodlNode, 'scrollPosition', pos);
					p.noodlNode._internal.pos = pos;
				}}
				onTopReached={() => sendSignal(p.noodlNode, 'topReached')}
				onBottomReached={() => sendSignal(p.noodlNode, 'bottomReached')}
				{...p}
				{...p.customProps}
			>
				{p.children}
			</ScrollArea>
		);
	else
		return (
			<ScrollArea.Autosize
				viewportRef={viewport}
				onScrollPositionChange={(pos) => {
					sendOutput(p.noodlNode, 'scrollPosition', pos);
					p.noodlNode._internal.pos = pos;
				}}
				onTopReached={() => sendSignal(p.noodlNode, 'topReached')}
				onBottomReached={() => sendSignal(p.noodlNode, 'bottomReached')}
				{...p}
				{...p.customProps}
			>
				{p.children}
			</ScrollArea.Autosize>
		);
});
