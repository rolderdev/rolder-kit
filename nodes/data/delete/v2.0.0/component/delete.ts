import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { Props } from '../node/definition';
import kDelete, { type BackendData } from './kDelete';
import type { JsComponent } from '@shared/node-v1.0.0';

export default {
	delete: async (p: Props, noodlNode) => {
		if (p.deleteScheme?.length) {
			sendOutput(noodlNode, 'deleting', true);
			const data: BackendData['data'] | undefined = await kDelete(p, p.deleteScheme);
			sendOutput(noodlNode, 'data', data);
			sendOutput(noodlNode, 'deleting', false);
			sendSignal(noodlNode, 'deleted');

			// Форсируем загрузку всех useData.
			let roots: string[] = [];

			for (const scheme of p.deleteScheme) {
				for (const id of scheme.ids) {
					const proxyItem = R.items[id];
					if (proxyItem)
						proxyItem.roots.forEach((rootId) => {
							if (!roots.includes(rootId)) roots.push(rootId);
						});
				}
			}

			roots.forEach((rootId) => Noodl.Events.emit(`${rootId}_fetch`));
		}
	},
} as JsComponent;
