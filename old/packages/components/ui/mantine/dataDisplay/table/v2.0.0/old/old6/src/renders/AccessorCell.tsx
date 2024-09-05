import { memo } from 'react';
import get from 'just-safe-get';
import { useStore } from '../store';
import { Box } from '@mantine/core';

export default memo((p: { itemId: string; columnIdx: number }) => {
	const store = useStore();
	if (!store) return;

	const accessor = store.columns.use((columns) => columns[p.columnIdx].accessor);
	// Вытягиваем значение ячейки. get делает реактивночть точечной, т.к. запрашивает конкртеный ключ.
	const value = store.items.use((items) => get(items.find((item) => item.id === p.itemId) || {}, accessor));

	const paddingLeft = store.tableProps.expansion.paddingLeft.use();
	const level = store.level.use();

	//console.log('AccessorCell render', value); // Считаем рендеры пока разрабатываем
	return <Box pl={paddingLeft.position === 'cell' ? paddingLeft.value * level : undefined}>{value}</Box>;
});
