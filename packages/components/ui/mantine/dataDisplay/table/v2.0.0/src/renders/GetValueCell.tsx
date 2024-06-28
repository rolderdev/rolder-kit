import { memo, useMemo } from 'react';
import get from 'just-safe-get';
import { useStore } from '../store';

export default memo((p: { itemId: string; columnIdx: number }) => {
	const store = useStore();
	if (!store) return;

	// Рекативность на изменение функции getValue и accessors
	const getValue = store.columns.use((columns) => columns[p.columnIdx].getValue);
	const accessors = store.columns.use((columns) => columns[p.columnIdx].accessors);

	// Рекативность на изменение данных в item по путям из accessors.
	const value = useMemo(() => {
		const items = store.items.get();
		const item = items.find((item) => item.id === p.itemId);
		return getValue?.(item || {}, items);
	}, [
		// Здесь важно в dependencies передавать массив значений, найденных в соотвествующем item.
		...(accessors?.map((accessor) =>
			store.items.use((items) => get(items.find((item) => item.id === p.itemId) || {}, accessor))
		) || []),
		getValue, // Чтобы реагировать на изменение самой функции.
	]);

	console.log('GetValueCell render', value); // Считаем рендеры пока разрабатываем
	return value;
});
