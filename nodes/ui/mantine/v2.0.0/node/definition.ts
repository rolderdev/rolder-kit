import { lazy } from 'react';
import type { MantineTheme, MantineColorScheme } from '@mantine/core';
import { type NotificationsProps, notifications } from '@mantine/notifications';
import { useInterval } from '@mantine/hooks';
import { isNotEmpty, isEmail, matches, isInRange, hasLength, matchesField } from '@mantine/form';
import type { BaseReactProps } from '@shared/node-v1.0.0';
import { getPortDef } from '@shared/port-v1.0.0';
import type { ReactNodeDef } from '@shared/node-v1.0.0';

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
	hashTag: '#expreimental',
	module: { dynamic: lazy(() => import('../component/Mantine')) },
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
	outputs: [],
	getInspectInfo: (p: Props) => (p.mantineTheme ? [{ type: 'value', value: p.mantineTheme }] : []),
	initialize: async (p: Props) => {
		// Нужно дождаться инициализации params в R.db
		await new Promise((resolve) => {
			const interval = setInterval(async () => {
				if (R.db?.states.params !== undefined) {
					clearInterval(interval);
					await R.db?.states.params.set('colorScheme', () => p.defaultColorScheme);
					resolve(undefined);
				}
			}, 50);
		});
	},
	disableCustomProps: true,
} satisfies ReactNodeDef;
