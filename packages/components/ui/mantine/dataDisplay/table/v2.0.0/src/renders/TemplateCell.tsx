import { memo } from 'react';
import { useStore } from '../store/store';
import { Box } from '@mantine/core';

export default memo((p: { itemId: string; columnIdx: number }) => {
	const s = useStore();
	if (!s) return;

	// Применим реактивность только к изменению кастомной ячейки.
	const templateCell = s.templateCells.use((s) => s[p.columnIdx]?.[p.itemId]);

	//const paddingLeft = s.hot.tableProps.expansion.paddingLeft.use();
	const paddingLeft = { value: 0, position: '0' };
	const level = s.level.use();

	//console.log('TemplateCell render', p.itemId); // Считаем рендеры пока разрабатываем
	return <Box pl={paddingLeft.position === 'cell' ? paddingLeft.value * level : undefined}>{templateCell}</Box>;
});
