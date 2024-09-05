import { memo } from 'react';
import get from 'just-safe-get';
import { useStore } from '../store/store';
import { Box } from '@mantine/core';

export default memo((p: { itemId: string; columnIdx: number }) => {
	const s = useStore();
	if (!s) return;

	const accessor = s.hot.columns.use((columns) => columns[p.columnIdx].accessor);
	// Вытягиваем значение ячейки. get делает реактивночть точечной, т.к. запрашивает конкртеный ключ.
	const value = s.hot.items.use((items) => get(items.find((item) => item.id === p.itemId) || {}, accessor));

	// Расчет отсупа функцией разработчика.
	const paddingLeftPostion = s.hot.tableProps.rowStyles.paddingLeftPostion.use();
	const level = s.level.use();
	const pl = s.hot.tableProps.use((state) =>
		state.paddingLeftFunc?.(
			level,
			s.hot.items.get((i) => i.find((i) => i.id === p.itemId))
		)
	);

	//console.log('AccessorCell render', value); // Считаем рендеры пока разрабатываем
	return <Box pl={paddingLeftPostion === 'cell' && !p.columnIdx ? pl : undefined}>{value}</Box>;
});
