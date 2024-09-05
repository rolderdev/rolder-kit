import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { MetaData } from '@nodes/table-v2.0.0';
import type { BaseProps, Props } from '../node/definition';
import type { JsComponent, NoodlNode } from '@shared/node-v1.0.0';

export const initStore = async (p: Props) =>
	({
		source: p.source,
		itemId: p.itemId,
		fields: p.fields,
	} satisfies BaseProps);

export default {
	reactive: (p: Props, noodlNode) => {
		const s = p.propsStore;
		// Перезапустим подписку при изменении параметров. Это порождает доп. подписки, т.к. нет отмены.
		let isChanged = false;

		if (p.source !== s.source) {
			s.source = p.source;
			isChanged = true;
		}
		if (p.itemId !== s.itemId) {
			s.itemId = p.itemId;
			isChanged = true;
		}
		if (!R.libs.just.compare(p.fields, s.fields)) {
			s.fields = p.fields;
			isChanged = true;
		}

		if (isChanged) subscribe(p, noodlNode);
	},
	subscribe: (p: Props, noodlNode) => subscribe(p, noodlNode),
} as JsComponent;

export const subscribe = async (p: Props, noodlNode: NoodlNode) => {
	const { subscribe, derive } = R.libs.valtio;

	let itemId: string | undefined = undefined;
	let metaData = noodlNode.nodeScope.componentOwner.metaData as MetaData | undefined;
	let repeaterItemId = noodlNode.nodeScope.componentOwner._forEachModel?.id;
	if (metaData) metaData.level++;

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

	// Подпишемся на изменения item, если подписки этой ноды еще нет.
	if (itemId) {
		const item = R.items.get(itemId);

		if (item) {
			noodlNode._internal.item = item;
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
};
