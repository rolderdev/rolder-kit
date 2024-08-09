/* Модель расширяемых строк. */

import { nanoid } from 'nanoid';
import { sendOutput, sendSignal } from '@packages/port-send';
import type { Item } from 'types';
import type { ChangeState, Store } from '../store/store';
import filterByItems from '../funcs/filterByItems';
import isEqual from 'lodash.isequal';

// Метод для отработки изменений настроек.
export const setExpansion = async (s: Store, changeState: ChangeState) => {
	// Прпускаем пока не инициализировано.
	if (s.inited.get()) {
		// Возьмем настройки для удобства.
		const coldExpansion = s.cold.tableProps.expansion.get();
		const hotExpansion = s.hot.tableProps.expansion.get();

		// Проверим, изменились ли настройки.
		if (!isEqual(coldExpansion, hotExpansion)) {
			// Присмене смене allowMultiple на false нужно оставить только одну развернутую строку.
			if (hotExpansion.allowMultiple && !coldExpansion.allowMultiple) {
				const expandedItem = s.cold.expandedItems.get()[0];
				s.cold.expandedItems.set(expandedItem ? [expandedItem] : []);
				changeState.expandedItems = true;
			}
			// Включение.
			if (!hotExpansion.enabled && coldExpansion.enabled) {
				await setExpansionRows(s as any);
				changeState.columns = true;
			}
			// Выключение.
			if (hotExpansion.enabled && !coldExpansion.enabled) {
				changeState.columns = true;
				s.cold.expandedItems.set([]);
				changeState.expandedItems = true;
			}
		}
	}
};

// Метод определения новых строк с порта. Проверяет на соответсвие items.
// expandedItems отдельно, чтобы можно было подать вручную при expandAll, unexpendAll
export const getExpandedItems = (s: Store, newExpandedItems: Item[]) => {
	let expandedItems = filterByItems(newExpandedItems, s.cold.items.get() || []);
	// Отфильтруем функцией разработчика.
	const filterFunc = s.cold.tableProps.expansionFilterFunc?.get();
	if (filterFunc && expandedItems) expandedItems = expandedItems.filter((i) => filterFunc(i));
	// Разработчик может подать больше одного не смотря на настроку allowMultiple = false. Чтобы он это увидел, сохраним только первый.
	if (!s.cold.tableProps.expansion.allowMultiple.get()) return expandedItems[0] ? [expandedItems[0]] : [];
	return expandedItems;
};

// Метод проверки на изменение состава развернутых строк.
// newExpandedItems отдельно, чтобы можно было подать вручную при expandAll, unexpendAll
export const expandedItemsChanged = (s: Store, newExpandedItems?: Item[]) => {
	if (s.cold.tableProps.expansion.enabled.get() && newExpandedItems) {
		const oldExpandedIds = s.cold.expandedItems.get().map((i) => i.id);
		const newExpandedIds = getExpandedItems(s, newExpandedItems).map((i) => i.id);
		// Не сравниваем содержимое items, это делается при изменении самих items.
		if (!isEqual(oldExpandedIds, newExpandedIds)) return true;
	}
	return false;
};

// Метод установки дефолтных строк с порта.
export const setDefaultExpandedItems = (s: Store, changeState: ChangeState, newExpandedItems?: Item[]) => {
	if (s.cold.items.get() && newExpandedItems?.length && !s.defaults.expandedItems.get()) {
		const expandedItems = getExpandedItems(s, newExpandedItems);
		s.defaults.expandedItems.set(true);
		s.cold.expandedItems.set(expandedItems);
		changeState.expandedItems = true;
		// При установке дефолта отправим в порт значение, но не сигнал.
		sendOutput(s.noodlNode.get(), 'expandedItems', expandedItems);
	}
};

// Метод установки новых строк с порта. Не срабатывает, если undefined.
export const setExpandedItems = (s: Store, newExpandedItems: Item[]) => {
	if (s.cold.items.get() && expandedItemsChanged(s, newExpandedItems)) {
		const expandedItems = getExpandedItems(s, newExpandedItems);
		s.cold.expandedItems.set(expandedItems);
		s.changeState.expandedItems.set(true);
		sendOutput(s.noodlNode.get(), 'expandedItems', expandedItems);
		sendSignal(s.noodlNode.get(), 'expandedItemsChanged');
	}
};

// Метод сброса строк с порта.
export const resetExpandedItems = (s: Store) => {
	if (s.cold.expandedItems.get().length) {
		s.cold.expandedItems.set([]);
		s.changeState.expandedItems.set(true);
		sendOutput(s.noodlNode.get(), 'expandedItems', []);
		sendSignal(s.noodlNode.get(), 'expandedItemsChanged');
	}
};

// Метод установки состояния развернутой строки по клику на строку или шеврон.
export const toggleRowExpansion = (s: Store, item: Item) => {
	if (s.cold.tableProps.expansion.enabled.get()) {
		const filterFunc = s.cold.tableProps.expansionFilterFunc?.get();
		if (filterFunc && !filterFunc(item)) return;
		s.set((state) => {
			let expandedItems = state.cold.expandedItems;
			if (state.cold.tableProps.expansion.allowMultiple) {
				if (expandedItems.some((i) => i.id === item.id)) expandedItems = expandedItems.filter((i) => i.id !== item.id);
				else expandedItems.push(item);
			} else {
				if (expandedItems.some((i) => i.id === item.id)) expandedItems = [];
				else expandedItems = [item];
			}
			state.cold.expandedItems = expandedItems;
			state.changeState.expandedItems = true;
		});

		// В store.set нельзя работать с Noodl.
		sendOutput(s.noodlNode.get(), 'expandedItems', s.cold.expandedItems.get());
		sendSignal(s.noodlNode.get(), 'expandedItemsChanged');
	}
};

// Метод создает расширяемые строки для всех items, у которых их еще нет.
export const setExpansionRows = async (s: Store) => {
	const items = s.cold.items.get() || [];
	await Promise.all(
		items.map(async (item) => {
			if (!s.expansionRows[item.id].get()) s.expansionRows[item.id].set(await getExpansionRow(s, item.id));
		})
	);
};

// Функция создает React-ноду для поданного item.
const getExpansionRow = async (s: Store, itemId: string) => {
	const noodlNode = s.noodlNode.get();
	// Без этого не работает. Шаман Noodl сказал так делать, почему не понятно.
	const group = noodlNode.nodeScope.createPrimitiveNode('Group');
	// Используем шаблон и присваиваем новый id
	const newNode = await noodlNode.nodeScope.createNode(s.cold.tableProps.expansion.template?.get(), nanoid(8), {
		// Отсюда Noodl берет item, когда разработчик использует "Object" и указывает "From repeater" в шаблоне.
		// Подразумевается, что объект Noodl уже создан.
		_forEachModel: Noodl.Objects[itemId],
		// Говорим Noodl, что таблица - это Repeater. Шаман мутный, но и с ним можно договориться.
		_forEachNode: noodlNode,
		// Запишем id, чтобы потом выятнуть его из props.noodlNode.nodeScope.componentOwner.itemId
		itemId,
	});
	// Добавляем в группу Noodl созданную ноду.
	group.addChild(newNode);
	// Здесь мы именно запускаем render, который возвращает React-ноду.
	return group.render() as React.ReactNode;
};
