import { memo, useContext, useEffect, useState } from 'react';
import { Box, Skeleton } from '@mantine/core';
import { TableContext } from '../TableProvider';
import getRoodlReactNode from '../funcs/getRoodlReactNode';

export default memo((p: { id: string; columnIdx: string }) => {
	const { get } = R.libs.just;
	const { snapshot, proxy } = R.libs.valtio;

	const store = useContext(TableContext);

	// Кастомный Suspense.
	const [templateCell, setTemplateCell] = useState<React.ReactNode | undefined>(undefined);
	useEffect(() => {
		getRoodlReactNode(store, p.id, get(store.columnsDefinition, [p.columnIdx, 'template'])).then((reactNode) =>
			setTemplateCell(reactNode)
		);
	}, []);

	// snapshot без подписки для передачи в функции.
	const itemSnap = R.items.get(p.id);

	// Расчет отсупа функцией разработчика.
	const paddingLeftPostion = store.tableProps.rowStyles.paddingLeftPostion;
	const level = store.level;
	const pl = store.tableProps.paddingLeftFunc?.(level, snapshot(itemSnap || proxy({})));

	//console.log('TemplateCell render', p.id); // Считаем рендеры пока разрабатываем
	// Проба пера - будет ли симпатичнее с Skeleton? Размер автоматически коректен.
	return (
		<Skeleton visible={!templateCell}>
			<Box pl={paddingLeftPostion === 'cell' && p.columnIdx === '0' ? pl : undefined}>{templateCell}</Box>
		</Skeleton>
	);
});
