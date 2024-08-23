import { memo, useContext, useEffect, useState } from 'react';
import { Box, Skeleton } from '@mantine/core';
import { TableContext } from '../TableProvider';
import getRoodlReactNode from '../funcs/getRoodlReactNode';

export default memo((p: { itemId: string; columnIdx: string }) => {
	const { get } = R.libs.just;
	const { proxy, snapshot, useSnapshot } = R.libs.valtio;

	const store = useContext(TableContext);
	const snap = useSnapshot(store);

	// Кастомный Suspense.
	const [templateCell, setTemplateCell] = useState<React.ReactNode | undefined>(undefined);
	useEffect(() => {
		getRoodlReactNode(store, p.itemId, get(snap.columnsDefinition, [p.columnIdx, 'template'])).then((reactNode) =>
			setTemplateCell(reactNode)
		);
	}, []);

	// snapshot без подписки для передачи в функции.
	const itemSnap = snapshot(get(store, ['items', p.itemId]) || proxy({}));

	// Расчет отсупа функцией разработчика.
	const paddingLeftPostion = store.tableProps.rowStyles.paddingLeftPostion;
	const level = store.level;
	const pl = store.tableProps.paddingLeftFunc?.(level, itemSnap);

	//console.log('TemplateCell render', p.itemId); // Считаем рендеры пока разрабатываем
	// Проба пера - будет ли симпатичнее с Skeleton? Размер автоматически коректен.
	return (
		<Skeleton visible={!templateCell}>
			<Box pl={paddingLeftPostion === 'cell' && p.columnIdx === '0' ? pl : undefined}>{templateCell}</Box>
		</Skeleton>
	);
});
