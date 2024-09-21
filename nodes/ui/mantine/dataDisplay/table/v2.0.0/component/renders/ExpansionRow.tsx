import { memo, useContext, useEffect, useState } from 'react';
import { Box, Center, Loader } from '@mantine/core';
import { TableContext } from '../TableProvider';
import getRoodlReactNode from '../funcs/getRoodlReactNode';
import useNode from '../funcs/useNode';

export default memo((p: { id: string }) => {
	const store = useContext(TableContext);

	const [expansionRow, setExpansionRow] = useState<React.ReactNode | undefined>(undefined);

	useEffect(() => {
		const nodeSnap = useNode(store, p.id, 'snap');
		if (nodeSnap)
			getRoodlReactNode(store, p.id, store.tableProps.expansion.template, {
				itemId: p.id,
				level: store.hierarchy.level,
				nodePath: nodeSnap.path,
			}).then((reactNode) => {
				if (nodeSnap.childIds.length >= store.tableProps.expansion.animationChildrenCount)
					setTimeout(() => setExpansionRow(reactNode), 200);
				else setExpansionRow(reactNode);
			});
	}, []);

	const LoaderAnimation = () => (
		<Center>
			<Loader size={store.libProps.loaderSize} color={store.libProps.loaderColor} type={store.libProps.loaderType} />
		</Center>
	);

	//console.log('ExpansionRow render', expansionRow); // Считаем рендеры пока разрабатываем
	// Уберем изменение цвета при наведении.
	return <Box style={{ background: 'white' }}>{expansionRow || <LoaderAnimation />}</Box>;
});
