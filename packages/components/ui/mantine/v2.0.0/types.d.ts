import type { MantineTheme, MantineColorScheme } from '@mantine/core';
import type { NotificationsProps } from '@mantine/notifications';
import type { BaseReactProps } from '@packages/node';

export type CompProps = BaseReactProps & {
	notificationsPosition: NotificationsProps['position'];
	defaultColorScheme: MantineColorScheme;
	mantineTheme: MantineTheme;
};
