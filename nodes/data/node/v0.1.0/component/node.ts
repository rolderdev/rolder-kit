import type { MetaData } from '@nodes/table-v2.0.0'
import type { NoodlNode } from '@shared/node-v1.0.0'
import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0'
import type { Props } from '../node/definition'

export default {}

export const subscribe = async (p: Props, noodlNode: NoodlNode) => {
	const { subscribe, snapshot } = R.libs.valtio

	const metaData = noodlNode.nodeScope.componentOwner.metaData as MetaData | undefined

	// Подпишемся на изменения ноды иерархии.
	const node = metaData?.nodePath ? R.nodes[metaData.nodePath] : undefined

	if (node && metaData?.nodePath) {
		p.node = node

		sendOutput(noodlNode, 'node', snapshot(node))
		sendSignal(noodlNode, 'nodeChanged')
		sendOutput(noodlNode, 'subscribed', true)

		p.unsub = subscribe(node, () => {
			sendOutput(noodlNode, 'node', snapshot(node))
			sendSignal(noodlNode, 'nodeChanged')
		})
	}
}
