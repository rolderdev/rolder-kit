import { Network } from '@capacitor/network'
import type { NoodlNode } from '@shared/node-v1.0.0'
import { sendOutput } from '@shared/port-send-v1.0.0'

export default async (noodlNode: NoodlNode) => {
	const network = await R.db.addState('network')
	const state = await Network.getStatus()

	await network.set('connected', () => state.connected)
	await network.set('connectionType', () => state.connectionType)

	sendOutput(noodlNode, 'networkType', state.connectionType)
	sendOutput(noodlNode, 'networkConnected', state.connected)

	noodlNode._internal.connected = state.connected
	noodlNode._internal.connectionType = state.connectionType

	Network.addListener('networkStatusChange', async (state) => {
		await network.set('connected', () => state.connected)
		await network.set('connectionType', () => state.connectionType)

		sendOutput(noodlNode, 'networkType', state.connectionType)
		sendOutput(noodlNode, 'networkConnected', state.connected)

		noodlNode._internal.connected = state.connected
		noodlNode._internal.connectionType = state.connectionType

		log.info('Network state changed', state)
	})

	log.info('Network initialized', state)
}
