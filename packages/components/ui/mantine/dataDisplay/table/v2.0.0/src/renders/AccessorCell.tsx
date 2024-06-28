import { memo } from 'react';
import get from 'just-safe-get';
import { useStore } from '../store';

export default memo((p: { itemId: string; accessor: string }) => {
	const store = useStore();
	if (!store) return;

	// Вытягиваем значение ячейки. get делает реактивночть точечной, т.к. запрашивает конкртеный ключ.
	const value = store.items.use((items) => get(items.find((item) => item.id === p.itemId) || {}, p.accessor));

	console.log('AccessorCell render', value); // Считаем рендеры пока разрабатываем
	return value;
});
