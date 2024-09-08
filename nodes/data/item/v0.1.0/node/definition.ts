import { getPortDef } from '@shared/port-v1.0.0';
import type { JsNodeDef, BaseJsProps } from '@shared/node-v1.0.0';
import type { InspectInfo } from '@shared/node-v1.0.0';
import { initStore } from '../component/item';
import type { MetaData } from '@nodes/table-v2.0.0';

export type Props = BaseJsProps & BaseProps & { propsStore: Store };

export type BaseProps = {
	source: 'specific' | 'table' | 'repeater';
	itemId?: string;
	fields?: string[];
};

export type Store = Omit<BaseProps, 'source' | 'itemId'> & {
	currentItemId?: string;
	subscribes: Map<string, { subscribed?: boolean; metaData?: MetaData }>;
	unsubs: any[];
	deriveUnsubs: any[];
};

export default {
	hashTag: '#pre-release',
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
		}),
		getPortDef({ name: 'fields', displayName: 'Fields', group: 'Custom', customGroup: 'Fields', type: 'proplist' }),
	],
	outputs: [
		getPortDef({ name: 'item', displayName: 'Item', group: 'Data', type: 'object' }),
		getPortDef({ name: 'itemChanged', displayName: 'Item changed', group: 'Signals', type: 'signal' }),
	],
	triggerOnInputs: () => ['source', 'itemId', 'fields'],
	getInspectInfo: (p: Props) => {
		const s = p.propsStore;
		if (!s) return [];

		let info = [] as InspectInfo[];

		if (s.currentItemId) {
			const sub = s.subscribes.get(s.currentItemId);
			if (sub)
				info = info.concat([
					{ type: 'text', value: `Subscribed: ${sub.subscribed}` },
					{ type: 'text', value: `Source: "${p.source}"` },
				]);
			if (sub?.metaData)
				info = info.concat([
					{ type: 'text', value: `Level: ${sub.metaData.level}` },
					{ type: 'text', value: `Node path: "${sub.metaData.nodePath}"` },
				]);
			if (sub?.subscribed)
				info = info.concat([
					{ type: 'text', value: `Item id: "${s.currentItemId}"` },
					{ type: 'value', value: R.items.get(s.currentItemId) },
				]);
		}

		return info as InspectInfo[];
	},
	initialize: async (p: Props, noodlNode) => {
		// Отпишемся, когда родитель отмонтировался. Родитель может быть страницей, в таком случае пропустим.
		if (noodlNode.nodeScope.componentOwner.parent.innerReactComponentRef)
			noodlNode.nodeScope.componentOwner.parent.innerReactComponentRef.componentWillUnmount = () => {
				p.propsStore.unsubs.forEach((i) => i?.());
				p.propsStore.deriveUnsubs.forEach((i) => R.libs.valtio.underive(i));
			};
		// Отпишемся, когда удален.
		noodlNode._onNodeDeleted = () => {
			p.propsStore.unsubs.forEach((i) => i?.());
			p.propsStore.deriveUnsubs.forEach((i) => R.libs.valtio.underive(i));
		};

		p.propsStore = initStore(p);
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
