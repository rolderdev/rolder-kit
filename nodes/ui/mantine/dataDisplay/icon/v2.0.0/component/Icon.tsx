import { forwardRef } from 'react';
import type { Props } from '../node/definition';
import { ThemeIcon } from '@mantine/core';

export default forwardRef(function (p: Props) {
	const Icon = p.name && R.libs.icons[p.name];

	if (Icon)
		return (
			<ThemeIcon {...p}>
				<Icon size={p.iconSize} stroke={p.stroke} />
			</ThemeIcon>
		);
	else return null;
});
