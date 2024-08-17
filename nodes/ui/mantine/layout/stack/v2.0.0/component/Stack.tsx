import { Stack, Text } from '@mantine/core';
import React from 'react';
import { forwardRef } from 'react';
import { Props } from '../types';

export default forwardRef(function (p: Props) {
	return (
		<Stack {...p} {...p.customProps}>
			{p.children}
		</Stack>
	);
});
