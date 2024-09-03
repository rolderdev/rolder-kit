import { getPortDef } from '@shared/port-v1.0.0';
import type { JsNodeDef, BaseJsProps } from '@shared/node-v1.0.0';
import { subscribe } from '../component/node';

export type Props = BaseJsProps;

export default {
	hashTag: '#expreimental',
	module: { dynamic: import('../component/node') },
	outputs: [
		getPortDef({ name: 'node', displayName: 'Node', group: 'Data', type: 'object' }),
		getPortDef({ name: 'nodeChanged', displayName: 'Node changed', group: 'Signals', type: 'signal' }),
	],
	getInspectInfo: (p: Props) =>
		p.noodlNode._internal.node
			? [
					{ type: 'text', value: `Item id: "${p.noodlNode._internal.node.itemId}"` },
					{ type: 'value', value: p.noodlNode._internal.node },
			  ]
			: [],
	initialize: async (p: Props) => {
		subscribe(p);
		return p;
	},
	disableCustomProps: true,
} satisfies JsNodeDef;
