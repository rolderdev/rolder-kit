import { getPortDef, sizes } from '@shared/port-v1.0.0';
import type { ReactNodeDef } from '@shared/node-v1.0.0';
import { lazy } from 'react';

export default {
	hashTag: '#expreimental',
	module: { dynamic: lazy(() => import('../component/Text')) },
	inputs: [
		getPortDef({
			name: 'sourceType',
			displayName: 'Source type',
			group: 'Params',
			type: [
				{ label: 'Item', value: 'item' },
				{ label: 'Value', value: 'value' },
			],
			default: 'item',
		}),
		getPortDef({
			name: 'value',
			displayName: 'Value',
			group: 'Data',
			type: 'string',
			dependsOn: (p) => p.sourceType === 'value',
		}),
		getPortDef({
			name: 'item',
			displayName: 'Item',
			group: 'Data',
			type: 'object',
			visibleAt: 'connection',
			dependsOn: (p) => p.sourceType === 'item',
		}),
		getPortDef({
			name: 'field',
			displayName: 'Field',
			group: 'Params',
			type: 'string',
			dependsOn: (p) => p.sourceType === 'item',
			validate: (p) => (p.sourceType === 'item' && !p.field ? false : true),
		}),
		getPortDef({
			name: 'size',
			displayName: 'Size',
			group: 'Custom',
			customGroup: 'Font',
			type: sizes,
			default: 'md',
		}),
	],
	getInspectInfo: (p) => (p.size ? [{ type: 'text', value: `Size: "${p.size}"` }] : []),
} satisfies ReactNodeDef;
