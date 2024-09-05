import { getPortDef } from '@shared/port-v1.0.0';
import type { JsNodeDef, BaseJsProps } from '@shared/node-v1.0.0';
import type { InspectInfo } from '@shared/node-v1.0.0';
import { initStore, subscribe } from '../component/item';

export type Props = BaseJsProps & BaseProps & { propsStore: BaseProps };

export type BaseProps = {
	source: 'specific' | 'table' | 'repeater';
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
				{ label: 'Table', value: 'table' },
				{ label: 'Repeater', value: 'repeater' },
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
		getPortDef({ name: 'fields', displayName: 'Fields', group: 'Custom', customGroup: 'Fields', type: 'proplist' }),
		getPortDef({ name: 'subscribe', displayName: 'Subscribe', group: 'Signals', type: 'signal' }),
	],
	outputs: [
		getPortDef({ name: 'item', displayName: 'Item', group: 'Data', type: 'object' }),
		getPortDef({ name: 'itemChanged', displayName: 'Item changed', group: 'Signals', type: 'signal' }),
	],
	triggerOnInputs: () => ['source', 'itemId', 'fields'],
	getInspectInfo: (p: Props, outProps, noodlNode) => {
		let info = [{ type: 'text', value: `Source: "${p.source}"` }];
		if (noodlNode._internal.metaData)
			info = info.concat([
				{ type: 'text', value: `Level: ${noodlNode._internal.metaData.level}` },
				{ type: 'text', value: `Node path: "${noodlNode._internal.metaData.nodePath}"` },
			]);
		if (noodlNode._internal.item)
			info = info.concat([
				{ type: 'text', value: `Item id: "${noodlNode._internal.item.id}"` },
				{ type: 'value', value: noodlNode._internal.item },
			]);
		return info as InspectInfo[];
	},
	initialize: async (p: Props, noodlNode) => {
		await subscribe(p, noodlNode);
		p.propsStore = await initStore(p);
	},
	transform(p: Props, portDefs) {
		portDefs.outputs = portDefs.outputs.filter((i: any) => i.group !== 'Fields');
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
