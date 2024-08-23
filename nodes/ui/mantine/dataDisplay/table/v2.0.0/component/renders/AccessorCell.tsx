import { memo, useContext } from 'react';
import { Box } from '@mantine/core';
import { TableContext } from '../TableProvider';

export default memo((p: { itemId: string; columnIdx: string }) => {
	const { get } = R.libs.just;
	const { snapshot, useSnapshot, proxy } = R.libs.valtio;

	const store = useContext(TableContext);
	const snap = useSnapshot(store);

	// snapshot без подписки для передачи в функции.
	const itemSnap = snapshot(get(store, ['items', p.itemId]) || proxy({}));
	// Без подписки, заменится при смене схемы колонок.
	const accessor = get(store, ['columnsDefinition', p.columnIdx, 'accessor']);
	// Точечная подписка на значение.
	const value = get(snap.items, `${p.itemId}.${accessor}`);

	// Расчет отсупа функцией разработчика.
	const paddingLeftPostion = store.tableProps.rowStyles.paddingLeftPostion;
	const level = store.level;
	const pl = store.tableProps.paddingLeftFunc?.(level, itemSnap);

	//console.log('AccessorCell render', value); // Считаем рендеры пока разрабатываем
	return <Box pl={paddingLeftPostion === 'cell' && p.columnIdx === '0' ? pl : undefined}>{value}</Box>;
});
