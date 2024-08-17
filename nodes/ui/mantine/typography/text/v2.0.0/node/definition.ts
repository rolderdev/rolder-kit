import { getPortDef } from '@shared/port-v1.0.0';
import { ReactNodeDef } from '@shared/node-v1.0.0';
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
			dependsOn(p) {
				return p.sourceType === 'value';
			},
		}),
		getPortDef({
			name: 'item',
			displayName: 'Item',
			group: 'Data',
			type: 'object',
			visibleAt: 'connection',
			dependsOn(p) {
				return p.sourceType === 'item';
			},
		}),
		getPortDef({
			name: 'field',
			displayName: 'Field',
			group: 'Params',
			type: 'string',
			dependsOn(p) {
				return p.sourceType === 'item';
			},
			validate(p) {
				return p.sourceType === 'item' && !p.field ? false : true;
			},
		}),
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
} satisfies ReactNodeDef;
