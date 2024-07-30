// Функция для обработки изменений при смене содержания items.

import type { Props } from '../../types';
import type { Store } from './store';

export default async (s: Store, p: Props) => {
	const { needsNoodlObjects } = s.cold.tableProps.get();
	if (p.items) {
		// Создадим или обновим иерархию, если это корень. Нужно делать до всего, т.к. от смены иерархии много зависит.
		if (s.scopeStore.get() && !s.isChild.get()) s.scopeStore.get()?.setHierarchy(s.tableId.get(), p.items);
		// Пересоздадим объекты Noodl, используемые в расширяемых строках и кастомных ячейках.
		if (needsNoodlObjects) for (const item of p.items || []) Noodl.Object.create(item);
	}
};
