import { createTheme, MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { Notifications } from '@mantine/notifications';
import { forwardRef, useEffect } from 'react';
import type { Props } from '../node/definition';
import colorSchemeManager from './colorSchemeManager';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './body.module.css';

export default forwardRef(function (p: Props) {
	const { notificationsPosition, defaultColorScheme, mantineTheme } = p;

	useEffect(() => {
		R.db?.states.params.set('colorScheme', () => defaultColorScheme);
	}, [defaultColorScheme]);

	const theme = createTheme(mantineTheme);
	return (
		<>
			<MantineProvider theme={theme} colorSchemeManager={colorSchemeManager}>
				<Notifications position={notificationsPosition} />
				<DatesProvider settings={{ locale: 'ru', firstDayOfWeek: 1 }}>{p.children}</DatesProvider>
			</MantineProvider>
		</>
	);
});
