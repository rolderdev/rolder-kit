import { lazy } from 'react';
import type { MantineTheme, MantineColorScheme } from '@mantine/core';
import { type NotificationsProps, notifications } from '@mantine/notifications';
import { useInterval } from '@mantine/hooks';
import { isNotEmpty, isEmail, matches, isInRange, hasLength, matchesField } from '@mantine/form';
import type { BaseReactProps } from '@shared/node-v1.0.0';
import { getPortDef } from '@shared/port-v1.0.0';
import type { ReactNodeDef } from '@shared/node-v1.0.0';
import validate from './validate';
import initState from '@shared/init-state-v0.1.0';

function MantineError(title: string, message?: string, autoClose?: boolean | number): void {
	notifications.show({ title, message, color: 'red', autoClose: autoClose ? autoClose : false });
}
export const mantine = {
	MantineError,
	form: { isNotEmpty, isEmail, matches, isInRange, hasLength, matchesField },
	hooks: { useInterval },
};
export type Mantine = typeof mantine;

export type Props = BaseReactProps & {
	notificationsPosition: NotificationsProps['position'];
	defaultColorScheme: MantineColorScheme;
	mantineTheme: MantineTheme;
};

export default {
	module: { dynamic: lazy(() => import('../component/Mantine')) }, // Обязательно динамика, т.к. при статике RsPack ругается на CSS.
	inNode: {
		inputs: [
			getPortDef({
				name: 'notificationsPosition',
				displayName: 'Notifications position',
				group: 'Layout',
				type: [
					{ label: 'Top left', value: 'top-left' },
					{ label: 'Top right', value: 'top-right' },
					{ label: 'Top center', value: 'top-center' },
					{ label: 'Bottom left', value: 'bottom-left' },
					{ label: 'Bottom right', value: 'bottom-right' },
					{ label: 'Bottom center', value: 'bottom-center' },
				],
				default: 'bottom-right',
			}),
			getPortDef({
				name: 'defaultColorScheme',
				displayName: 'Default color scheme',
				group: 'Styles',
				type: [
					{ label: 'Light', value: 'light' },
					{ label: 'Dark', value: 'dark' },
					{ label: 'Auto', value: 'auto' },
				],
				default: 'light',
			}),
			getPortDef({
				name: 'mantineTheme',
				displayName: 'Mantine theme',
				group: 'Styles',
				type: 'objectEval',
				codeComment: `/* Тема Mantine. Смотри документацию - https://mantine.dev/theming/theme-object/
	() => ({
		components: {
			Image: { defaultProps: { radius: 'md' } }
		}
	})*/`,
			}),
		],
	},
	afterNode: {
		validate: async (p: Props, model) => validate(model),
		getInspectInfo: (p: Props) => (p.mantineTheme ? [{ type: 'value', value: p.mantineTheme }] : []),
	},
	beforeComponent: {
		initialize: async (p: Props) => {
			await initState('initialized');
		},
	},
	disableCustomProps: true,
} satisfies ReactNodeDef;
