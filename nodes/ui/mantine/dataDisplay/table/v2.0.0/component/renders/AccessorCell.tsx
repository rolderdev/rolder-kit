import { memo, useContext } from 'react';
import { Box } from '@mantine/core';
import { TableContext } from '../TableProvider';

export default memo((p: { id: string; columnIdx: string }) => {
	const { get } = R.libs.just;
	const { useSnapshot, proxy } = R.libs.valtio;

	const store = useContext(TableContext);
	const itemSnap = useSnapshot(R.items.get(p.id) || proxy({}));

	// Без подписки, заменится при смене схемы колонок.
	const accessor = get(store, ['columnsDefinition', p.columnIdx, 'accessor']);
	// Точечная подписка на значение.
	const value = get(itemSnap, accessor);

	// Расчет отсупа функцией разработчика.
	const paddingLeftPostion = store.tableProps.rowStyles.paddingLeftPostion;
	const level = store.level;
	const pl = store.tableProps.paddingLeftFunc?.(level, itemSnap);

	//console.log('AccessorCell render', value); // Считаем рендеры пока разрабатываем
	return <Box pl={paddingLeftPostion === 'cell' && p.columnIdx === '0' ? pl : undefined}>{value}</Box>;
});
