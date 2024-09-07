import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { MetaData } from '@nodes/table-v2.0.0';
import type { Props, Store } from '../node/definition';
import type { JsComponent, NoodlNode } from '@shared/node-v1.0.0';

export const initStore = (p: Props) =>
	({
		fields: p.fields, // Сравнивать есть смысл только поля, так как подписка на item работает одинаково при любом источнике.
		subscribes: new Map(),
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
			s.itemId = itemId;
			const item = R.items.get(itemId);

			//// Сценарии пописки.
			if (item) {
				const subscribed = s.subscribes.get(item.id)?.subscribed;

				// 1. Когда item есть сразу.
				if (!subscribed) {
					s.subscribes.set(itemId, { metaData });
					subscribe(p, noodlNode);
				} else {
					// 2. При смене полей. Для удобства разработки, в runtime всегда равны.
					if (!R.libs.just.compare(p.fields, s.fields)) {
						s.fields = p.fields;
						s.subscribes.set(itemId, { metaData });
						subscribe(p, noodlNode);
					}
				}
			} else {
				// 3. Когда есть id, но еще нет item. Например, если id прилетает с параметров страницы.
				const interval = setInterval(() => {
					const i = R.items.get(itemId);
					if (i) {
						clearInterval(interval);
						s.subscribes.set(itemId, { metaData });
						subscribe(p, noodlNode);
					}
				}, 50);
			}
		}
	},
} as JsComponent;

export const subscribe = async (p: Props, noodlNode: NoodlNode) => {
	const { subscribe, derive } = R.libs.valtio;
	const itemId = p.propsStore.itemId;

	if (itemId) {
		const sub = p.propsStore.subscribes.get(itemId);
		if (sub && !sub.subscribed) {
			sub.subscribed = true;
			const item = R.items.get(itemId);

			if (item) {
				sendOutput(noodlNode, 'item', item);
				sendSignal(noodlNode, 'itemChanged');

				// Подпишемся на сам item.
				subscribe(item, () => {
					sendOutput(noodlNode, 'item', item);
					sendSignal(noodlNode, 'itemChanged');
				});

				// Подпишемся на выбранные разработчиком поля.
				// Возьмем каждое поле и сделаем из него derive-прокси, что позволит реагировать только на поля.
				p.fields?.map((field) => {
					const derived = derive({ field: (get) => R.libs.just.get(get(item), field) });
					sendOutput(noodlNode, field, derived.field);

					subscribe(derived, () => sendOutput(noodlNode, field, derived.field));
				});
			}
		}
	}
};
