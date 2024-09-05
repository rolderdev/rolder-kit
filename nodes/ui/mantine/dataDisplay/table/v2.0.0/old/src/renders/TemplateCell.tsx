import { memo } from 'react';
import { useStore } from '../store/store';
import { Box } from '@mantine/core';

export default memo((p: { itemId: string; columnIdx: number }) => {
	const s = useStore();
	if (!s) return;

	// Применим реактивность только к изменению кастомной ячейки.
	const templateCell = s.templateCells.use((s) => s[p.columnIdx]?.[p.itemId]);

	// Расчет отсупа функцией разработчика.
	const paddingLeftPostion = s.hot.tableProps.rowStyles.paddingLeftPostion.use();
	const level = s.level.use();
	const pl = s.hot.tableProps.use((state) =>
		state.paddingLeftFunc?.(
			level,
			s.hot.items.get((i) => i.find((i) => i.id === p.itemId))
		)
	);

	//console.log('TemplateCell render', p.itemId); // Считаем рендеры пока разрабатываем
	return <Box pl={paddingLeftPostion === 'cell' && !p.columnIdx ? pl : undefined}>{templateCell}</Box>;
});
