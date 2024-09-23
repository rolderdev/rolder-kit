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
				const { merge, unset } = R.libs.lodash;
				const { omit, clone } = R.libs.just;

				let scopeUpdate: { [rootId: string]: Record<string, 'in' | 'out'> } = {};
				for (const scheme of p.updateScheme) {
					for (const item of scheme.items) {
						// Нужно клонировать перед мутацией, т.к. разарботчик может положить части прокси в item, что мутирует его и запишет не верно в БД.
						const clonedItem = clone(item);
						const proxyItem = R.items[clonedItem.id];
						if (proxyItem) {
							// lodash.merge - мутирует прокси, что нам и нужно, т.к. заменять прокси нельзя, потеряем точечную реактивность.
							// Нам не нужен history в item.
							merge(proxyItem, omit(clonedItem, ['history']));
							// Удалим ключи. Это работает и для конструкции - someArray[0].someField
							if (scheme.deleteFields?.length) for (const deleteField of scheme.deleteFields) unset(proxyItem, deleteField);
							// Отправим в useData все items всех схем, если в них указан scope.
							if (scheme.scope) {
								proxyItem.roots.forEach((rootId) => R.libs.just.set(scopeUpdate, [rootId, clonedItem.id], scheme.scope));
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
