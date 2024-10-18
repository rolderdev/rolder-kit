import type { NoodlNode } from '@shared/node-v1.0.0'
import { sendOutput } from '@shared/port-send-v1.0.0'
import type { FilterState, Props } from '../node/definition'

export default {
	close: (p: Props, noodlNode: NoodlNode) => {
		const close = noodlNode.nodeScope.componentOwner.metaData.close as () => void | undefined
		close?.()
	},
}

export const subscribe = async (p: Props, noodlNode: NoodlNode) => {
	const { subscribe } = R.libs.valtio

	const filterState = noodlNode.nodeScope.componentOwner.metaData.filterState as FilterState | undefined

	if (filterState) {
		p.columnIdx = noodlNode.nodeScope.componentOwner.metaData.columnIdx as string | undefined
		p.filterState = filterState

		sendOutput(noodlNode, 'state', filterState)
		sendOutput(noodlNode, 'enabled', filterState.enabled)
		sendOutput(noodlNode, 'value', filterState.value)
		sendOutput(noodlNode, 'defaultValue', filterState.defaultValue)
		sendOutput(noodlNode, 'subscribed', true)

		p.unsub = subscribe(filterState, () => {
			sendOutput(noodlNode, 'state', filterState)
			sendOutput(noodlNode, 'enabled', filterState.enabled)
			sendOutput(noodlNode, 'value', filterState.value)
		})
	}
}
