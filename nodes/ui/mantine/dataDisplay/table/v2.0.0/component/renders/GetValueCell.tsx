import { memo, useContext, useEffect, useState } from 'react';
import { Box } from '@mantine/core';
import { TableContext } from '../TableProvider';

export default memo((p: { itemId: string; columnIdx: string }) => {
	const { get } = R.libs.just;
	const { useSnapshot, proxy } = R.libs.valtio;

	const store = useContext(TableContext);
	const snap = useSnapshot(store);
	const [value, setValue] = useState<string | number | undefined>();

	// snapshot с подпиской.
	const itemSnap = get(snap, ['items', p.itemId]) || proxy({});
	// Без подписки, заменится при смене схемы колонок.
	const getValue = get(store, ['columnsDefinition', p.columnIdx, 'getValue']);
	const hierarchyNode = store.hierarchyNode?.find((i) => i.data.id === itemSnap.id);
	// Точечная подписка на выполнение кода подписки.

	useEffect(() => {
		try {
			const v = getValue && itemSnap ? getValue(itemSnap, snap.items, hierarchyNode) : undefined;
			if (v !== value) setValue(v);
		} catch (e: any) {
			log.error('getValue error', e);
			R.libs.mantine?.MantineError?.('Системная ошибка!', `getValue error. ${e.message}`);
		}
	}, [itemSnap]);

	// Расчет отсупа функцией разработчика.
	const paddingLeftPostion = store.tableProps.rowStyles.paddingLeftPostion;
	const level = store.level;
	// Не будем давать разработчику редаактировать item внутри функции.
	const pl = store.tableProps.paddingLeftFunc?.(level, itemSnap);

	//console.log('GetValueCell render', value); // Считаем рендеры пока разрабатываем
	return <Box pl={paddingLeftPostion === 'cell' && p.columnIdx === '0' ? pl : undefined}>{value}</Box>;
});
