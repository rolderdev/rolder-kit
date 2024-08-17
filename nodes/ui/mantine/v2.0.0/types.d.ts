import type { MantineTheme, MantineColorScheme } from '@mantine/core';
import type { NotificationsProps } from '@mantine/notifications';
import type { BaseReactProps } from '@shared/node-v1.0.0';

export type Props = BaseReactProps & {
	notificationsPosition: NotificationsProps['position'];
	defaultColorScheme: MantineColorScheme;
	mantineTheme: MantineTheme;
};
