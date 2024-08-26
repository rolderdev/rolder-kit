import { memo, useContext, useEffect, useState } from 'react';
import { Box } from '@mantine/core';
import { TableContext } from '../TableProvider';

export default memo((p: { id: string; columnIdx: string }) => {
	const { get } = R.libs.just;
	const { useSnapshot, proxy, snapshot } = R.libs.valtio;

	const store = useContext(TableContext);

	const [value, setValue] = useState<string | number | undefined>();

	// snapshot с подпиской.
	const itemSnap = useSnapshot(R.items.get(p.id) || proxy({}));
	// Все items таблицы без подписки и snapshot.
	const itemsSnap = store.records
		.map((i) => {
			const item = R.items.get(i.id);
			if (item) return snapshot(item);
			return;
		})
		.filter((i) => i !== undefined);
	// Без подписки, заменится при смене схемы колонок.
	const getValue = get(store, ['columnsDefinition', p.columnIdx, 'getValue']);

	// Точечная подписка на выполнение кода.
	useEffect(() => {
		try {
			const v = getValue && itemSnap ? getValue(itemSnap, itemsSnap) : undefined;
			if (v !== value) setValue(v);
		} catch (e: any) {
			log.error('getValue error', e);
			R.libs.mantine?.MantineError?.('Системная ошибка!', `getValue error. ${e.message}`);
		}
	}, [itemSnap]);

	// Расчет отсупа функцией разработчика.
	const paddingLeftPostion = store.tableProps.rowStyles.paddingLeftPostion;
	const level = store.level;
	const pl = store.tableProps.paddingLeftFunc?.(level, itemSnap);

	//console.log('GetValueCell render', value); // Считаем рендеры пока разрабатываем
	return <Box pl={paddingLeftPostion === 'cell' && p.columnIdx === '0' ? pl : undefined}>{value}</Box>;
});
