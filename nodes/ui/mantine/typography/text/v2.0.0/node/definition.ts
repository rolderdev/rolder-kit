import { getPortDef } from '@shared/port-v1.0.0';
import { ReactNodeDef } from '@shared/node-v1.0.0';
import { lazy } from 'react';

export default {
	hashTag: '#expreimental',
	module: { dynamic: lazy(() => import('../component/text')) },
	inputs: [
		getPortDef({
			name: 'size',
			displayName: 'Size',
			group: 'Custom',
			customGroup: 'Font',
			type: [
				{ label: 'xs', value: 'xs' },
				{ label: 'sm', value: 'sm' },
				{ label: 'md', value: 'md' },
				{ label: 'lg', value: 'lg' },
				{ label: 'xl', value: 'xl' },
			],
			default: 'md',
		}),
	],
	outputs: [],
	getInspectInfo(p) {
		if (p.size) return [{ type: 'text', value: `Size: "${p.size}"` }];
		else return [];
	},
	disableCustomProps: true,
} satisfies ReactNodeDef;
