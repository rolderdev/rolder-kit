import { getPortDef } from '@shared/port-v1.0.0';
import type { JsNodeDef, BaseJsProps } from '@shared/node-v1.0.0';
import { subscribe } from '../component/node';
import type Node from '@nodes/use-data-v2.0.0/component/Node';
import { clearWarning, sendWarning } from '@shared/node-v1.0.0/src/editorModels/warning';
import initState from '@shared/init-state-v0.1.0';

export type Props = BaseJsProps & { node: Node; unsub: any };

export default {
	hashTag: '#pre-release',
	module: { dynamic: import('../component/node') },
	outputs: [
		getPortDef({ name: 'node', displayName: 'Node', group: 'Data', type: 'object' }),
		getPortDef({ name: 'nodeChanged', displayName: 'Node changed', group: 'Signals', type: 'signal' }),
	],
	getInspectInfo: (p: Props) =>
		p.node
			? [
					{ type: 'text', value: `Item id: "${p.node.itemId}"` },
					{ type: 'value', value: p.node },
			  ]
			: [],
	initialize: async (p: Props, noodlNode) => {
		await initState('initialized');

		const nodePath = noodlNode.nodeScope.componentOwner.metaData?.nodePath;
		if (!Noodl.deployed) {
			if (!nodePath)
				sendWarning(noodlNode.model, noodlNode.context, 'global', 'global', 'Node must be in Table with hierarchy enabled.');
			else {
				clearWarning(noodlNode.model, noodlNode.context, 'global', 'global');
				await subscribe(p, noodlNode);
			}
		} else await subscribe(p, noodlNode);

		// Отпишемся, когда родитель отмонтировался.
		if (noodlNode.nodeScope.componentOwner._forEachNode)
			noodlNode.nodeScope.componentOwner._forEachNode.innerReactComponentRef.componentWillUnmount = () => p.unsub?.();
		// Отпишемся, когда удален.
		noodlNode._onNodeDeleted = () => p.unsub?.();
	},
	disableCustomProps: true,
} satisfies JsNodeDef;
