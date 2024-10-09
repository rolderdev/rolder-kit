import { forwardRef } from 'react';
import type { Props } from '../node/definition';
import { getThemeColor, ThemeIcon, useMantineTheme } from '@mantine/core';

export default forwardRef(function (p: Props) {
	const Icon = p.name && R.libs.icons[p.name];
	const iconSize = p.type === 'icon' ? p.iconSize : p.iconThemeSize;
	const theme = useMantineTheme();
	const iconColor = p.type === 'icon' && !p.disabled && p.iconColor ? getThemeColor(p.iconColor || 'black', theme) : undefined;
	const themeColor = p.type === 'themeIcon' && !p.disabled ? p.themeColor : 'gray';

	if (Icon)
		if (p.type === 'icon') return <Icon size={iconSize} color={iconColor} stroke={p.stroke} />;
		else
			return (
				<ThemeIcon color={themeColor} {...p}>
					<Icon size={iconSize} color={iconColor} stroke={p.stroke} />
				</ThemeIcon>
			);
	else return null;
});
