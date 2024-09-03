import { Stack } from '@mantine/core';
import { forwardRef } from 'react';
import type { Props } from '../node/definition';

export default forwardRef(function (p: Props) {
	return (
		<Stack {...p} {...p.customProps}>
			{p.children}
		</Stack>
	);
});
