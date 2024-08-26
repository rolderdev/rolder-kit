import { getPortDef } from '@shared/port-v1.0.0';
import type { JsNodeDef } from '@shared/node-v1.0.0';
import type { Props } from '../types';
import type { InspectInfo } from '@shared/node-v1.0.0/types';
import { subscribe } from '../component/item';

export default {
	hashTag: '#expreimental',
	module: { dynamic: import('../component/item') },
	inputs: [
		getPortDef({
			name: 'source',
			displayName: 'Source',
			group: 'Params',
			type: [
				{ label: 'Specific', value: 'specific' },
				{ label: 'From repeater', value: 'repeater' },
			],
			default: 'specific',
			visibleAt: 'editor',
		}),
		getPortDef({
			name: 'itemId',
			displayName: 'Item id',
			group: 'Params',
			type: 'string',
			dependsOn: (p: Props) => p.source === 'specific',
			validate: (p: Props) => (p.source === 'specific' ? (p.itemId ? true : false) : true),
		}),
		getPortDef({
			name: 'fields',
			displayName: 'Fields',
			group: 'Custom',
			customGroup: 'Fields',
			type: 'proplist',
		}),
	],
	outputs: [
		getPortDef({ name: 'item', displayName: 'Item', group: 'Data', type: 'object' }),
		getPortDef({ name: 'itemChanged', displayName: 'Changed', group: 'Signals', type: 'signal' }),
	],
	triggerOnInputs: () => ['source', 'itemId'],
	getInspectInfo: (p: Props) => {
		let info = [{ type: 'text', value: `Source: "${p.source}"` }];
		if (p.noodlNode._internal.item)
			info = info.concat([
				{ type: 'text', value: `Item id: "${p.noodlNode._internal.item.id}"` },
				{ type: 'value', value: p.noodlNode._internal.item },
			]);
		return info as InspectInfo[];
	},
	initialize: async (p: Props) => {
		//console.log('initialize', p.noodlNode.id);
		// Для ситуации, когда нода запускается первый раз, т.к. срабатывает одновременно reactive и этот код.
		p.noodlNode._internal.firstRun = true;
		subscribe(p);
		setTimeout(() => (p.noodlNode._internal.firstRun = false), 10);
		return p;
	},
	transform(p: Props, portDefs) {
		portDefs.outputs = portDefs.outputs.filter((i) => i.customGroup !== 'Fields');
		if (p.fields)
			p.fields.map((field) => {
				if (!portDefs.outputs.some((i) => i.name === field))
					portDefs.outputs.push(
						getPortDef({
							name: field,
							displayName: field,
							group: 'Custom',
							customGroup: `Fields`,
							type: '*',
						})
					);
			});

		return portDefs;
	},
	disableCustomProps: true,
} satisfies JsNodeDef;
