// Функция для обработки изменений при смене содержания items.

import type { Store } from './store';

export default async (s: Store) => {
	const { needsNoodlObjects } = s.cold.tableProps.get();
	const items = s.cold.items.get();
	if (items) {
		// Создадим или обновим иерархию, если это корень. Нужно делать до всего, т.к. от смены иерархии много зависит.
		if (s.scopeStore.get() && !s.isChild.get()) s.scopeStore.get()?.setHierarchy(s.tableId.get(), items);
		// Пересоздадим объекты Noodl, используемые в расширяемых строках и кастомных ячейках.
		if (needsNoodlObjects)
			for (const item of items) {
				// Нужно созда отдельные объекты на случай пвоторов в иерархии.
				if (item.fid) Noodl.Object.create({ ...item, id: item.fid, oid: item.id });
				Noodl.Object.create(item);
			}
	}
};
