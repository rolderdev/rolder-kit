import { memo } from 'react';
import { Box } from '@mantine/core';
import { useStore } from '../store/store';

export default memo((p: { itemId: string }) => {
	const s = useStore();
	if (!s) return;

	const expansionRow = s.expansionRows.use((expansionRows) => expansionRows[p.itemId]);

	//console.log('ExpansionRow render', p.itemId); // Считаем рендеры пока разрабатываем
	return (
		// Уберем изменение цвета при наведении.
		<Box style={{ background: 'white' }}>{expansionRow}</Box>
	);
});
