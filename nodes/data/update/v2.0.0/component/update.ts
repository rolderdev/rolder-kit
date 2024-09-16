import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { Props } from '../node/definition';
import kUpdate, { type BackendData } from './kUpdate';
import type { JsComponent } from '@shared/node-v1.0.0';

export default {
	update: async (p: Props, noodlNode) => {
		if (p.updateScheme?.length) {
			// Выясним примерный размер отправляемго запроса.
			let megaBytes = 0;
			for (const scheme of p.updateScheme) {
				const size = new TextEncoder().encode(JSON.stringify(scheme.items)).length;
				megaBytes += size / 1024 / 1024;
			}
			log.info(`Update node request size: ${megaBytes} MB`);

			if (megaBytes > 1) {
				log.error(`Update node request size exceeded 1 MB. Got ${megaBytes} MB`);
				R.libs.mantine.MantineError?.('Системная ошибка!', `Update node request size exceeded 1 MB. Got ${megaBytes} MB`);
			}

			// Обновим оптимистично.
			if (p.optimistic) {
				let scopeUpdate: { [rootId: string]: Record<string, 'in' | 'out'> } = {};
				for (const scheme of p.updateScheme) {
					for (const item of scheme.items) {
						const proxyItem = R.items[item.id];
						if (proxyItem) {
							// lodash.merge - мутирует прокси, что нам и нужно, т.к. заменять прокси нельзя, потеряем точечную реактивность.
							R.libs.lodash.merge(proxyItem, item);
							// Удалим ключи. Это работает и для конструкции - someArray[0].someField
							if (scheme.deleteFields?.length)
								for (const deleteField of scheme.deleteFields) {
									R.libs.lodash.unset(proxyItem, deleteField);
								}
							// Отправим в useData все items всех схем, если в них указан scope.
							if (scheme.scope) {
								proxyItem.roots.forEach((rootId) => R.libs.just.set(scopeUpdate, [rootId, item.id], scheme.scope));
							}
						}
					}
				}

				R.libs.just.map(scopeUpdate, (rootId, itemsScope) => {
					Noodl.Events.emit(`${rootId}_handleHierarchy`, itemsScope);
				});
			}

			sendOutput(noodlNode, 'updating', true);
			const data: BackendData['data'] | undefined = await kUpdate(p, p.updateScheme);
			sendOutput(noodlNode, 'data', data);
			sendOutput(noodlNode, 'updating', false);
			sendSignal(noodlNode, 'updated');
		}
	},
} as JsComponent;
