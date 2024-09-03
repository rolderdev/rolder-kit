import { getPortDef } from '@shared/port-v1.0.0';
import type { JsNodeDef, BaseJsProps } from '@shared/node-v1.0.0';
import type { InspectInfo } from '@shared/node-v1.0.0/types';
import { initStore, subscribe } from '../component/item';

export type Props = BaseJsProps & BaseProps & { propsStore: BaseProps };

export type BaseProps = {
	source: 'specific' | 'expansionRow' | 'templateCell';
	itemId?: string;
	fields?: string[];
};

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
				{ label: 'Expansion row', value: 'expansionRow' },
				{ label: 'Template cell', value: 'templateCell' },
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
		getPortDef({ name: 'itemChanged', displayName: 'Item changed', group: 'Signals', type: 'signal' }),
		getPortDef({ name: 'node', displayName: 'Node', group: 'Data', type: 'object' }),
		getPortDef({ name: 'nodeChanged', displayName: 'Node changed', group: 'Signals', type: 'signal' }),
	],
	triggerOnInputs: () => ['source', 'itemId', 'fields'],
	getInspectInfo: (p: Props) => {
		let info = [{ type: 'text', value: `Source: "${p.source}"` }];
		if (p.noodlNode._internal.metaData)
			info = info.concat([
				{ type: 'text', value: `Level: ${p.noodlNode._internal.metaData.level}` },
				{ type: 'text', value: `Node path: "${p.noodlNode._internal.metaData.nodePath}"` },
			]);
		if (p.noodlNode._internal.item)
			info = info.concat([
				{ type: 'text', value: `Item id: "${p.noodlNode._internal.item.id}"` },
				{ type: 'value', value: p.noodlNode._internal.item },
			]);
		return info as InspectInfo[];
	},
	initialize: async (p: Props) => {
		subscribe(p);
		p.propsStore = initStore(p);
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
