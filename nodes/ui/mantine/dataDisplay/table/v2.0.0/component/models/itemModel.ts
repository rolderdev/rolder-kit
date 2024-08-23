/* Модель item. */
import type { FrontItem } from '@shared/types-v0.1.0';
import type { Props } from '../../types';
import type { HierarchyNode } from '@nodes/use-data-v2.0.0';

export type TableRecord = { id: string };
export type ForntItems = Record<string, FrontItem>;

export const setItems = (p: Props) => {
	const { compare, get, set, map } = R.libs.just;

	if (p.items) {
		// Добавление
		p.items.map((item) => {
			let hierarchyNode: HierarchyNode | undefined = undefined;
			if (p.useExpansionHierarchy) {
				hierarchyNode = p.hierarchyNode?.find((i) => i.data.id === item.id);
				if (hierarchyNode) hierarchyNode = R.libs.valtio.proxy(hierarchyNode);
			}

			// Создадим Roodl-объект, чтобы кастомная ячейка и расширяемоя строка могли принимать данные.
			// Для него нужно сравнение, чтобы не тригерить при каждой подаче.
			if (!compare(get(p.store.items, item.id), item)) {
				set(p.store.items, item.id, item); // Прокси справится со сравнением, но раз уж сравниваем для Roodl-объекта...
				// Добавим ноду в Roodl-объект, если включена иерархия и ее нода подана.
				Noodl.Object.create({ ...get(p.store.items, item.id), hierarchyNode });
			} else if (hierarchyNode) {
				// Обновим ноду иерархи.
				Noodl.Objects[item.id].hierarchyNode = hierarchyNode;
			}
		});

		// Удаление
		map(p.store.items, (itemId) => {
			if (!p.items?.map((i) => i.id).includes(itemId)) delete p.store.items[itemId];
		});

		p.store.records = p.items.map((i) => ({ id: i.id }));
	} else {
		p.store.records = [];
		p.store.items = {};
	}
};
