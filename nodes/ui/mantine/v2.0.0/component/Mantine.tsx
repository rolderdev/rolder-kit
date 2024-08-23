import { ColorSchemeScript, createTheme, MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { Notifications, notifications } from '@mantine/notifications';
import { forwardRef } from 'react';
import type { Props } from '../types';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

function MantineError(title: string, message?: string, autoClose?: boolean | number): void {
	notifications.show({ title, message, color: 'red', autoClose: autoClose ? autoClose : false });
}
R.libs.mantine = { MantineError };

export default forwardRef(function (props: Props) {
	const { notificationsPosition, defaultColorScheme, mantineTheme } = props;

	const theme = createTheme(mantineTheme);
	return (
		<>
			<ColorSchemeScript defaultColorScheme={defaultColorScheme} />
			<MantineProvider theme={theme} defaultColorScheme={defaultColorScheme}>
				<Notifications position={notificationsPosition} />
				<DatesProvider settings={{ locale: 'ru', firstDayOfWeek: 1 }}>{props.children}</DatesProvider>
			</MantineProvider>
		</>
	);
});
