import { sendOutput } from '@shared/port-send-v1.0.0';
import type { Props } from '../types';

export default {
	reactive: (p: Props) => (!p.noodlNode._internal.firstRun ? subscribe(p) : undefined),
};

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

			const subscribed = R.subscribes.get(itemId)?.includes(nid);

			// Подпишемся на сам item.
			if (!subscribed) {
				//console.log('subscribe', R.subscribes.get(itemId));
				R.subscribes.get(itemId)?.push(nid);
				subscribe(item, () => sendOutput(p.noodlNode, 'item', item));
			}

			// Подпишемся на выбранные разработчиком поля.
			// Возьмем каждое поле и сделаем из него derive-прокси, что позволит реагировать только на поля.
			p.fields?.map((field) => {
				const derived = derive({
					field: (get: any) => R.libs.just.get(get(item), field),
				});
				sendOutput(p.noodlNode, field, derived.field);

				if (!subscribed) subscribe(derived, () => sendOutput(p.noodlNode, field, derived.field));
			});

			// Отпишимся при удалении ноды во избежание задвоения подписок.
			//p.noodlNode._onNodeDeleted = () => {};
		}
	}
};
