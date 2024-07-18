import { memo } from 'react';
import { useStore } from '../store';

export default memo((p: { itemId: string; columnIdx: number }) => {
	const store = useStore();
	if (!store) return;

	// Подпишемся на изменение самой функции.
	const getValue = store.columns.use((columns) => columns[p.columnIdx].getValue);

	// Здесь важно делать вычисления внутри use, тогда рендеринг будет точечный.
	const value = store.items.use((i) => {
		const item = i.find((i) => i.id === p.itemId);
		const hierarchyNode = store.get((s) => s.scope?.get()?.hierarchy?.find((i) => i.data.id === p.itemId));
		return getValue?.(item || {}, store.items.get(), hierarchyNode);
	});

	//console.log('GetValueCell render', value); // Считаем рендеры пока разрабатываем
	return value;
});
