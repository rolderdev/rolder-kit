import { memo, useEffect, useState } from 'react';
import { useStore } from '../store';
import getTemplateCell from '../funcs/getTemplateCell';

export default memo((p: { itemId: string; columnIdx: number }) => {
	const store = useStore();
	if (!store) return;

	const [templateCell, setTemplateCell] = useState<React.ReactNode>(null);

	useEffect(() => {
		if (!templateCell) getTemplateCell(store, p.itemId, p.columnIdx).then((reactNode) => setTemplateCell(reactNode));
	}, []);

	//console.log('TemplateCell render', p.itemId); // Считаем рендеры пока разрабатываем
	return templateCell;
});
