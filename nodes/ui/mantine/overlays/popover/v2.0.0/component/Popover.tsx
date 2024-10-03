import { Box, Popover } from '@mantine/core';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import type { Props } from '../node/definition';
import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';

export default forwardRef(function (p: Props, ref) {
	const children: any = p.children;

	const target = Array.isArray(children)
		? children.filter((i) => i.props.noodlNode.model?.type.split('.')[2] === 'PopoverTarget')?.[0]
		: children?.props.noodlNode.model?.type.split('.')[2] === 'PopoverTarget'
		? children
		: null;

	const dropdown = Array.isArray(children)
		? children.filter((i) => i.props.noodlNode.model?.type.split('.')[2] === 'PopoverDropdown')?.[0]
		: children?.props.noodlNode.model?.type.split('.')[2] === 'PopoverDropdown'
		? children
		: null;

	const [opened, setOpened] = useState(false);

	useEffect(() => {
		sendOutput(p.noodlNode, 'state', opened);
		if (!opened) sendSignal(p.noodlNode, 'closed');
	}, [opened]);

	useImperativeHandle(
		ref,
		() => ({
			open: () => {
				if (!opened) setOpened(true);
			},
			close: () => {
				if (opened) setOpened(false);
			},
			toggle: () => setOpened(!opened),
		}),
		[opened]
	);

	// Popover.Target поддерживает только одного ребенка и ему нужен ref. Обернем в Box, это удовлетворит оба требования.
	return (
		<Popover
			offset={p.useCustomOffset ? p.customOffset : p.numberOffset}
			opened={opened}
			onChange={setOpened}
			{...p}
			{...p.customProps}
		>
			<Popover.Target>
				<Box>{target}</Box>
			</Popover.Target>
			<Popover.Dropdown {...p.dropdownProps}>{dropdown}</Popover.Dropdown>
		</Popover>
	);
});
