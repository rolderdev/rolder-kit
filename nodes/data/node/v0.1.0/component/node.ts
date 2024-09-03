import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { MetaData } from '@nodes/table-v2.0.0';
import type { Props } from '../node/definition';

export default {};

export const subscribe = (p: Props) => {
	const { subscribe, snapshot } = R.libs.valtio;

	let metaData = p.noodlNode.nodeScope.componentOwner.metaData as MetaData | undefined;

	// Подпишемся на изменения ноды иерархии.
	const node = metaData?.nodePath ? R.nodes.get(metaData.nodePath) : undefined;

	if (node) {
		p.noodlNode._internal.node = node;
		sendOutput(p.noodlNode, 'node', snapshot(node));
		sendSignal(p.noodlNode, 'nodeChanged');

		subscribe(node, () => {
			sendOutput(p.noodlNode, 'node', snapshot(node));
			sendSignal(p.noodlNode, 'nodeChanged');
		});
	}
};
