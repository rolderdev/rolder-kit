import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { MetaData } from '@nodes/table-v2.0.0';
import type { Props, Store } from '../node/definition';
import type { JsComponent, NoodlNode } from '@shared/node-v1.0.0';
import unsubscribe from './unsubscribe';

export const initStore = (p: Props) =>
	({
		// Сравнивать есть смысл только поля, так как подписка на item работает одинаково при любом источнике.
		fields: p.fields,
		subscribes: new Map(),
		unsubs: [],
		deriveUnsubs: [],
	} satisfies Store);

export default {
	reactive: (p: Props, noodlNode) => {
		const s = p.propsStore;

		let metaData = noodlNode.nodeScope.componentOwner.metaData as MetaData | undefined;
		let repeaterItemId = noodlNode.nodeScope.componentOwner._forEachModel?.id;
		if (metaData) metaData.level++;

		let itemId: string | undefined = undefined;

		// Возьмем itemId из указанного источника, если его нет, организуем fallback.
		switch (p.source) {
			case 'specific':
				itemId = p.itemId;
				break;
			case 'table':
				itemId = metaData?.itemId;
				break;
			case 'repeater':
				itemId = repeaterItemId;
				break;
			default:
				p.itemId ? (itemId = p.itemId) : (itemId = repeaterItemId);
		}

		if (itemId) {
			const item = R.items[itemId];

			//// Сценарии пописки.
			if (item) {
				const subscribed = s.subscribes.get(item.id)?.subscribed;

				// 1. Когда item есть сразу.
				if (!subscribed) {
					s.currentItemId = itemId;
					s.subscribes.set(itemId, { metaData });
					subscribe(p, noodlNode);
				} else {
					// 2. При смене полей.
					if (!R.libs.just.compare(p.fields, s.fields)) {
						s.currentItemId = itemId;
						s.fields = p.fields;

						s.subscribes.set(itemId, { metaData });
						subscribe(p, noodlNode);

						// При смене itemId, но присутствующей подписке, нужно обновить значения портов.
					} else if (s.currentItemId !== itemId) {
						s.currentItemId = itemId;

						sendOutput(noodlNode, 'item', item);
						sendSignal(noodlNode, 'itemChanged');

						s.fields?.map((field) => {
							const value = R.libs.just.get(item, field);
							sendOutput(noodlNode, field, value !== undefined ? value : null);
						});
					}
				}
			} else {
				// 3. Когда есть id, но еще нет item. Например, если id прилетает с параметров страницы.
				const interval = setInterval(() => {
					const i = R.items[itemId];
					if (i) {
						clearInterval(interval);
						s.currentItemId = itemId;
						s.subscribes.set(itemId, { metaData });
						subscribe(p, noodlNode);
					}
				}, 50);
			}

			// Если itemId больше нет, нужно отписаться и почистить все порты.
		} else {
			unsubscribe(p);
			s.currentItemId = undefined;
			sendOutput(noodlNode, 'item', null);
			s.fields?.map((field) => {
				sendOutput(noodlNode, field, null);
			});
		}
	},
} as JsComponent;

export const subscribe = async (p: Props, noodlNode: NoodlNode) => {
	const { subscribe, derive } = R.libs.valtio;
	const itemId = p.propsStore.currentItemId;

	if (itemId) {
		const sub = p.propsStore.subscribes.get(itemId);
		if (sub && !sub.subscribed) {
			sub.subscribed = true;
			const item = R.items[itemId];

			if (item) {
				sendOutput(noodlNode, 'item', item);
				sendSignal(noodlNode, 'itemChanged');
				sendOutput(noodlNode, 'subscribed', true);

				// Подпишемся на сам item.
				p.propsStore.unsubs.push(
					subscribe(item, () => {
						sendOutput(noodlNode, 'item', item);
						sendSignal(noodlNode, 'itemChanged');
					})
				);

				// Подпишемся на выбранные разработчиком поля.
				// Возьмем каждое поле и сделаем из него derive-прокси, что позволит реагировать только на поля.
				p.propsStore.fields?.map((field) => {
					const derived = derive({ field: (get) => R.libs.just.get(get(item), field) });
					sendOutput(noodlNode, field, derived.field !== undefined ? derived.field : null);

					p.propsStore.deriveUnsubs.push(derived);
					p.propsStore.unsubs.push(
						subscribe(derived, () => sendOutput(noodlNode, field, derived.field !== undefined ? derived.field : null))
					);
				});
			}
		}
	}
};
