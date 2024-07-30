import { memo, useContext } from 'react';
import { useStore } from 'zustand';
import { TableContext } from '../store/store';

export default memo((p: { rowId: string }) => {
	const store = useContext(TableContext);
	if (!store) return;

	// Состояние готовности кастномных ячеек строки и/или разворачиваемой строки.
	const expansionRow = useStore(store, (s) => s.rows.get(p.rowId)?.expansionRow);

	console.log('ExpansionRow render', p.rowId); // Считаем рендеры пока разрабатываем

	return expansionRow;
});
