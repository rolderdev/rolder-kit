import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0';
import type { BaseProps, Props } from '../types';

export const initStore = (p: Props) =>
	R.libs.valtio.proxy<BaseProps>({
		source: p.source,
		itemId: p.itemId,
		fields: p.fields,
	});

export default {
	reactive: (p: Props) => {
		const s = p.propsStore;
		// Перезапустим подписку при изменении параметров.
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

const funcNames = ['getChildren'];

export const subscribe = (p: Props) => {
	const { subscribe, derive } = R.libs.valtio;

	const nid = p.noodlNode.id;
	let itemId: string | undefined = undefined;

	// Возьмем itemId из указанного прямо или из Repeater.
	if (p.source === 'specific') itemId = p.itemId;
	else itemId = p.noodlNode.nodeScope.componentOwner._forEachModel?.id;

	// Подпишемся на изменения item, если подписки этой ноды еще нет.
	if (itemId) {
		const item = R.items.get(itemId);

		if (item) {
			p.noodlNode._internal.item = item;
			sendOutput(p.noodlNode, 'item', item);
			sendSignal(p.noodlNode, 'itemChanged');

			const subscribed = R.itemHandlers.subscribes.get(itemId)?.includes(nid);

			// Подпишемся на сам item.
			if (!subscribed) {
				//console.log('subscribe', R.subscribes.get(itemId));
				R.itemHandlers.subscribes.get(itemId)?.push(nid);
				subscribe(item, () => {
					sendOutput(p.noodlNode, 'item', item);
					sendSignal(p.noodlNode, 'itemChanged');
				});
			}

			// Подпишемся на выбранные разработчиком поля, исключив функции.
			// Возьмем каждое поле и сделаем из него derive-прокси, что позволит реагировать только на поля.
			p.fields
				?.filter((i) => !funcNames.includes(i))
				.map((field) => {
					const derived = derive({
						field: (get) => R.libs.just.get(get(item), field),
					});
					sendOutput(p.noodlNode, field, derived.field);

					if (!subscribed) subscribe(derived, () => sendOutput(p.noodlNode, field, derived.field));
				});

			// Подпишемся на выбранные разработчиком функции.
			if (p.fields?.some((i) => funcNames.includes(i))) {
				p.fields.map((field) => funcNames.includes(field) && sendOutput(p.noodlNode, field, item[field]));
				if (!subscribed)
					p.fields.map(
						(field) =>
							funcNames.includes(field) &&
							Noodl.Events.on(`${field}_${itemId}`, () => {
								console.log('sub', field);
								sendOutput(p.noodlNode, field, item[field]);
							})
					);
			}

			// Отпишимся при удалении ноды во избежание задвоения подписок.
			/* 			p.noodlNode._onNodeDeleted = () => {
				console.log('destroy');
			}; */
		}
	}
};
