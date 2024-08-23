import { memo, useContext, useEffect, useState } from 'react';
import { Box, Center, Loader } from '@mantine/core';
import { TableContext } from '../TableProvider';
import getRoodlReactNode from '../funcs/getRoodlReactNode';

export default memo((p: { itemId: string }) => {
	const store = useContext(TableContext);
	const snap = R.libs.valtio.useSnapshot(store);

	const [expansionRow, setExpansionRow] = useState<React.ReactNode | undefined>(undefined);

	useEffect(() => {
		getRoodlReactNode(store, p.itemId, snap.tableProps.expansion.template, { id: p.itemId, level: snap.level }).then(
			(reactNode) => {
				const childrenCount = snap.hierarchyNode?.find((i) => i.data.id === p.itemId)?.children?.length || 0;
				if (childrenCount >= snap.tableProps.expansion.animationChildrenCount) setTimeout(() => setExpansionRow(reactNode), 200);
				else setExpansionRow(reactNode);
			}
		);
	}, []);

	const LoaderAnimation = () => (
		<Center>
			<Loader size={snap.libProps.loaderSize} color={snap.libProps.loaderColor} type={snap.libProps.loaderType} />
		</Center>
	);

	//console.log('ExpansionRow render', p.itemId); // Считаем рендеры пока разрабатываем
	// Уберем изменение цвета при наведении.
	return <Box style={{ background: 'white' }}>{expansionRow || <LoaderAnimation />}</Box>;
});
