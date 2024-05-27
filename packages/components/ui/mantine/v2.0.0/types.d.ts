import { MantineTheme, type MantineColorScheme } from '@mantine/core';
import { NotificationsProps } from '@mantine/notifications';
import { BaseReactProps } from '@packages/node';
import { RolderType } from '@packages/types';

export type CompProps = BaseReactProps & {
	notificationsPosition: NotificationsProps['position'];
	defaultColorScheme: MantineColorScheme;
};
