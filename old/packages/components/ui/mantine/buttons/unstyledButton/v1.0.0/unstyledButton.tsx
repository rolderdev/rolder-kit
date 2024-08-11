import { forwardRef } from 'react';
import type { Props } from './types';
import { getCompProps } from '@packages/get-comp-props';
import { useTableCellScope } from '@packages/scope';
import { UnstyledButton } from '@mantine/core';
import { sendSignal } from '@packages/port-send';

export default forwardRef(function (props: Props) {
	const item = useTableCellScope();
	const p = { ...getCompProps(props, item) } as Props;

	return (
		<UnstyledButton
			onClick={(e) => {
				e.stopPropagation();
				sendSignal(props.noodlNode, 'clicked');
			}}
			{...p}
			{...p.customProps}
		>
			{p.children}
		</UnstyledButton>
	);
});
