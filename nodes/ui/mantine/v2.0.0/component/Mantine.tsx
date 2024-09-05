import { ColorSchemeScript, createTheme, MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { Notifications } from '@mantine/notifications';
import { forwardRef } from 'react';
import type { Props } from '../node/definition';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './body.module.css';

export default forwardRef(function (p: Props) {
	const { notificationsPosition, defaultColorScheme, mantineTheme } = p;

	const theme = createTheme(mantineTheme);
	return (
		<>
			<ColorSchemeScript defaultColorScheme={defaultColorScheme} />
			<MantineProvider theme={theme} defaultColorScheme={defaultColorScheme}>
				<Notifications position={notificationsPosition} />
				<DatesProvider settings={{ locale: 'ru', firstDayOfWeek: 1 }}>{p.children}</DatesProvider>
			</MantineProvider>
		</>
	);
});
