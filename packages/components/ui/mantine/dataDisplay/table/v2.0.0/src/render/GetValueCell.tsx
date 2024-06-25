import { memo, useContext, useMemo } from 'react';
import { Skeleton } from '@mantine/core';
import { useStore } from 'zustand';
import { TableContext } from '../store/store';
import get from 'just-safe-get';

export default memo((p: { rowId: string; columnIdx: number }) => {
	const store = useContext(TableContext);
	if (!store) return;

	// Рекативность на изменение функции getValue
	const getValue = useStore(store, (s) => s.columns[p.columnIdx].getValue);

	// Рекативность на изменение данных в item по путям из accessors.
	const value = useMemo(() => {
		const item = store.getState().rows.get(p.rowId)?.item;
		const items = Array.from(store.getState().rows.values()).map((i) => i.item);
		return getValue?.(item || {}, items);
	}, [
		// Здесь важно оборачивать один useStore в другой, а не делать перебор в теле функции только одного useStore.
		useStore(store, (s) => s.columns[p.columnIdx].accessors)?.map((accessor) =>
			useStore(store, (s) => get(s.rows.get(p.rowId)?.item || {}, accessor))
		),
		getValue, // Чтобы реагировать на изменение самой функции.
	]);

	// Состояние готовности кастномных ячеек строки и/или разворачиваемой строки.
	const ready = useStore(store, (s) => s.rows.get(p.rowId)?.ready);

	console.log('GetValueCell render', value); // Считаем рендеры пока разрабатываем
	return <Skeleton visible={!ready}>{value}</Skeleton>;
});
