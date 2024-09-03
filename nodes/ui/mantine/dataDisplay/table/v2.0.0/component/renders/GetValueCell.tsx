import { memo, useContext, useState } from 'react';
import { Box } from '@mantine/core';
import { TableContext } from '../TableProvider';
import useNode from '../funcs/useNode';
import useItem from '../funcs/useItem';
import type { Column } from '../models/columnModel';

export default memo((p: { id: string; columnIdx: string }) => {
	const store = useContext(TableContext);

	const [value, setValue] = useState<string | number | undefined>();

	const itemSnap = useItem(p.id, 'snap');
	const itemSub = useItem(p.id, 'sub');

	// Все items таблицы без подписки и snapshot.
	const itemsSnap = store.records.map((i) => useItem(i.id, 'snap')).filter((i) => i !== undefined);
	const nodeSub = useNode(store, p.id, 'sub');
	// Без подписки, заменится при смене схемы колонок.
	const column: Column = R.libs.just.get(store, ['columnsDefinition', p.columnIdx]);
	const getValue = column.getValue;

	try {
		// Точечная подписка на выполнение кода.
		const v = getValue && itemSub ? getValue(itemSub, itemsSnap, nodeSub) : undefined;
		if (['string', 'number', 'undefined'].includes(typeof v)) {
			if (v !== value) setValue(v);
		} else {
			log.error(`getValue cell error. Wrong return type, expect "string", "number" or "undefined", got ${typeof v}`, column);
			R.libs.mantine?.MantineError?.(
				'Системная ошибка!',
				`getValue cell error. Wrong return type, expect "string", "number" or "undefined", got ${typeof v}. Column idx: ${
					column.idx
				}`
			);
		}
	} catch (e: any) {
		log.error('getValue error', e);
		R.libs.mantine?.MantineError?.('Системная ошибка!', `getValue error. ${e.message}`);
	}

	// Расчет отсупа функцией разработчика.
	const paddingLeftPostion = store.tableProps.rowStyles.paddingLeftPostion;
	const level = store.hierarchy.level;
	const pl = store.tableProps.paddingLeftFunc?.(level, itemSnap);

	//console.log('GetValueCell render', value); // Считаем рендеры пока разрабатываем
	return <Box pl={paddingLeftPostion === 'cell' && p.columnIdx === '0' ? pl : undefined}>{value}</Box>;
});
