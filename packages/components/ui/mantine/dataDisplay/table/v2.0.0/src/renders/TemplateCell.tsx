import { memo } from 'react';
import { useStore } from '../store';

export default memo((p: { itemId: string; columnIdx: number }) => {
	const store = useStore();
	if (!store) return;

	// Применим реактивность только к изменению кастомной ячейки.
	const templateCell = store.templateCells.use((templateCells) => templateCells[p.columnIdx]?.[p.itemId]);

	//console.log('TemplateCell render', p.itemId); // Считаем рендеры пока разрабатываем
	return templateCell;
});
