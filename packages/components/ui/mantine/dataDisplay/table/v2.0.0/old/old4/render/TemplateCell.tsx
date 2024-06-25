import { memo, useContext } from 'react';
import { TableContext } from '../../table';
import type { Store } from '../../types';
import { useSnapshot } from 'valtio';
import type { Record } from '../models/recordMoldel';
import { Skeleton } from '@mantine/core';

export default memo((p: { recordId: string; columnIdx: number }) => {
	const store = useContext(TableContext) as Store;
	const templateCells = useSnapshot(store.records.get(p.recordId)?.templateCells || {}) as Record;
	const snap = useSnapshot(store);

	console.log('TemplateCell render'); // Считаем рендеры пока разрабатываем
	return (
		<Skeleton visible={!snap?.ready} height={21}>
			{/*@ts-ignore */}
			{templateCells[p.columnIdx] || 'loading'}
		</Skeleton>
	);
});
