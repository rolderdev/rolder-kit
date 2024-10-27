import type { JsComponent } from '@shared/node-v1.0.0'
import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0'
import type { Props } from '../node/definition'
import kDelete, { type BackendData } from './kDelete'

export default {
	delete: async (p: Props, noodlNode) => {
		if (p.deleteScheme?.length) {
			sendOutput(noodlNode, 'deleting', true)
			const data: BackendData['data'] | undefined = await kDelete(p, p.deleteScheme)
			sendOutput(noodlNode, 'data', data)
			sendOutput(noodlNode, 'deleting', false)
			sendSignal(noodlNode, 'deleted')
		}
	},
} as JsComponent
