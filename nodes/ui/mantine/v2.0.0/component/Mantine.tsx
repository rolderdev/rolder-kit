import {
	Box,
	createTheme,
	DEFAULT_THEME,
	getThemeColor,
	MantineProvider,
	Transition,
	useMantineTheme,
	type MantineColor,
} from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { Notifications } from '@mantine/notifications';
import { forwardRef, useEffect, useState } from 'react';
import type { Props } from '../node/definition';
import colorSchemeManager from './colorSchemeManager';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './body.module.css';
import './fonts.module.css';

export default forwardRef(function (p: Props) {
	const { notificationsPosition, defaultColorScheme, mantineTheme } = p;

	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	useEffect(() => {
		R.db?.states.params.set('colorScheme', () => defaultColorScheme);
	}, [defaultColorScheme]);

	const theme = createTheme({
		...mantineTheme,
		fontFamily: `IBM Plex Sans, ${DEFAULT_THEME.fontFamily}`,
		headings: { fontFamily: `IBM Plex Sans, ${DEFAULT_THEME.fontFamily}` },
	});

	const Scripts = () => {
		// Для возможности вычислять цвет в Roodl.
		const theme = useMantineTheme();
		R.libs.mantine.getThemeColor = (color: MantineColor) => getThemeColor(color, theme);
		return null;
	};

	return (
		<>
			<MantineProvider theme={theme} colorSchemeManager={colorSchemeManager}>
				<Scripts />
				<Notifications position={notificationsPosition} />
				<DatesProvider settings={{ locale: 'ru', firstDayOfWeek: 1 }}>
					<Transition mounted={mounted} transition="fade" duration={400} timingFunction="ease">
						{(styles) => (
							<Box style={styles} h="100vh">
								{p.children}
							</Box>
						)}
					</Transition>
				</DatesProvider>
			</MantineProvider>
		</>
	);
});
