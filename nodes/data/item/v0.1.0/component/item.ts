import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { MetaData } from '@nodes/table-v2.0.0';
import type { BaseProps, Props } from '../node/definition';

export const initStore = (p: Props) =>
	({
		source: p.source,
		itemId: p.itemId,
		fields: p.fields,
	} satisfies BaseProps);

export default {
	reactive: (p: Props) => {
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

		if (isChanged) subscribe(p);
	},
};

export const subscribe = (p: Props) => {
	const { subscribe, derive } = R.libs.valtio;

	let itemId: string | undefined = undefined;
	let metaData = p.noodlNode.nodeScope.componentOwner.metaData as MetaData | undefined;
	if (metaData) metaData.level++;

	// Возьмем itemId из указанного прямо или из Repeater.
	if (p.source === 'specific') itemId = p.itemId;
	else itemId = metaData?.itemId;

	// Подпишемся на изменения item, если подписки этой ноды еще нет.
	if (itemId) {
		const item = R.items.get(itemId);

		if (item) {
			p.noodlNode._internal.item = item;
			sendOutput(p.noodlNode, 'item', item);
			sendSignal(p.noodlNode, 'itemChanged');

			// Подпишемся на сам item.
			subscribe(item, () => {
				sendOutput(p.noodlNode, 'item', item);
				sendSignal(p.noodlNode, 'itemChanged');
			});

			// Подпишемся на выбранные разработчиком поля.
			// Возьмем каждое поле и сделаем из него derive-прокси, что позволит реагировать только на поля.
			p.fields?.map((field) => {
				const derived = derive({ field: (get) => R.libs.just.get(get(item), field) });
				sendOutput(p.noodlNode, field, derived.field);

				subscribe(derived, () => sendOutput(p.noodlNode, field, derived.field));
			});
		}
	}
};
