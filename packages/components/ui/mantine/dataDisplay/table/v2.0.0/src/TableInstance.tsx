/* Управляющая компонента. Управляет состояние дочерней Table. */

import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useShallowEffect } from '@mantine/hooks';
import type { Props } from '../types';
import { useStore } from './store/store';
import Table from './Table';
import { setSelectedItemsFromScope } from './models/multiSelectionModel';

export default forwardRef((p: Props, ref) => {
	const s = useStore();
	if (!s) return;

	// Возвращаем store в TableProvider для внешних сигналов.
	useImperativeHandle(ref, () => ({ store: s }), [s]);

	// Не будем показывать таблицу пока ее параметры не готовы.
	const inited = s.inited.use();

	//// Реактивность на изменения TableScope.
	const scopeStore = s.scopeStore.get();
	// Мульти-выбор.
	const selectedItems = scopeStore?.selectedItems.use({ items: p.items || [] });
	useShallowEffect(() => {
		if (selectedItems) setSelectedItemsFromScope(s, selectedItems);
	}, selectedItems);

	//// Обновление состояния с портов.
	useEffect(() => {
		s.updateColdState(p);
	}, [p]);

	//console.log('TableInstance run'); // Считаем запуски пока разрабатываем
	return inited && <Table />;
});
