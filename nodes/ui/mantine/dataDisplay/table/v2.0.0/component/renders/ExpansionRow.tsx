import { memo, useContext, useEffect, useState } from 'react';
import { Box, Center, Loader } from '@mantine/core';
import { TableContext } from '../TableProvider';
import getRoodlReactNode from '../funcs/getRoodlReactNode';

export default memo((p: { id: string }) => {
	const store = useContext(TableContext);

	const [expansionRow, setExpansionRow] = useState<React.ReactNode | undefined>(undefined);

	useEffect(() => {
		getRoodlReactNode(store, p.id, store.tableProps.expansion.template, { id: p.id, level: store.level }).then((reactNode) => {
			const childrenCount = R.items.get(p.id)?.getChildren().length || 0;
			if (childrenCount >= store.tableProps.expansion.animationChildrenCount) setTimeout(() => setExpansionRow(reactNode), 200);
			else setExpansionRow(reactNode);
		});
	}, []);

	const LoaderAnimation = () => (
		<Center>
			<Loader size={store.libProps.loaderSize} color={store.libProps.loaderColor} type={store.libProps.loaderType} />
		</Center>
	);

	//console.log('ExpansionRow render', p.itemId); // Считаем рендеры пока разрабатываем
	// Уберем изменение цвета при наведении.
	return <Box style={{ background: 'white' }}>{expansionRow || <LoaderAnimation />}</Box>;
});
