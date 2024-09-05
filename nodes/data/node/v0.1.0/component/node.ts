import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { MetaData } from '@nodes/table-v2.0.0';
import type { Props } from '../node/definition';
import type { NoodlNode } from '@shared/node-v1.0.0';

export default {};

export const subscribe = async (p: Props, noodlNode: NoodlNode) => {
	const { subscribe, snapshot } = R.libs.valtio;

	let metaData = noodlNode.nodeScope.componentOwner.metaData as MetaData | undefined;

	// Подпишемся на изменения ноды иерархии.
	const node = metaData?.nodePath ? R.nodes.get(metaData.nodePath) : undefined;

	if (node) {
		noodlNode._internal.node = node;
		sendOutput(noodlNode, 'node', snapshot(node));
		sendSignal(noodlNode, 'nodeChanged');

		subscribe(node, () => {
			sendOutput(noodlNode, 'node', snapshot(node));
			sendSignal(noodlNode, 'nodeChanged');
		});
	}
};
