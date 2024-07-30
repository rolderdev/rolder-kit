import { memo, useContext } from 'react';
import { TableContext } from '../../table';
import type { Store } from '../../types';
import { useSnapshot } from 'valtio';
import { Skeleton } from '@mantine/core';

export default memo((p: { getValueStringFunc: string; recordId: string }) => {
	const store = useContext(TableContext) as Store;
	const item = useSnapshot(store.records.get(p.recordId)?.item || {});
	const snap = useSnapshot(store);

	const getValue = () => {
		let value = undefined;
		// try catch, т.к. разработчик человек ))
		try {
			value = eval(p.getValueStringFunc)(item);
		} catch (error: any) {
			R.libs.mantine?.MantineError(
				'Системная ошибка',
				`getValue eval error: ${error.message}. itemId: ${item.id}, func: ${p.getValueStringFunc}`
			);
		}
		return value;
	};

	console.log('GetValueCell render', getValue()); // Считаем рендеры пока разрабатываем
	return <Skeleton visible={!snap?.ready}>{getValue()}</Skeleton>;
});
