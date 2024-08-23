import { getPortDef } from '@shared/port-v1.0.0';
import type { ReactNodeDef } from '@shared/node-v1.0.0';
import { lazy } from 'react';

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
	getInspectInfo: (p) => (p.mantineTheme ? [{ type: 'value', value: p.mantineTheme }] : []),
	disableCustomProps: true,
} satisfies ReactNodeDef;
