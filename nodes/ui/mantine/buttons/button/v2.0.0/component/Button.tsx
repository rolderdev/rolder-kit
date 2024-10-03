import { Button } from '@mantine/core';
import { forwardRef } from 'react';
import type { Props } from '../node/definition';
import { sendSignal } from '@shared/port-send-v1.0.0';

export default forwardRef(function (p: Props) {
	return (
		<Button
			onClick={(e) => {
				e.stopPropagation();
				sendSignal(p.noodlNode, 'clicked');
			}}
			{...p}
			{...p.customProps}
		>
			{p.children}
		</Button>
	);
});
