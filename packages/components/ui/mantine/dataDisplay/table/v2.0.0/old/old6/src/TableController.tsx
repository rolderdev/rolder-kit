/* Управляющая компонента. Управляет состояние дочерней TableInstance. */

import { forwardRef, useEffect, useImperativeHandle } from 'react';
import type { Props } from '../types';
import { useStore } from './store';
import { useHeaderCheckboxProps } from './models/multiSelectionModel';
import TableInstance from './TableInstance';

export default forwardRef((p: Props, ref) => {
	const store = useStore();
	if (!store) return;

	// Возвращаем store в Table для внешних сигналов.
	useImperativeHandle(ref, () => ({ store }), [store]);

	// Реактинвость на изменение портов.
	useEffect(() => {
		store.setLibProps(p);
		store.setTableProps(p);
		store.setColumns(p);
		store.setItems(p);
		store.setTemplateCells();
		store.setSelectedItems(p.selectedItems || []);
		store.setExpansionRows();
	}, [p]);

	// Реактивность на изменения TableScope.
	const selectedItems = p.scopeDbClass ? store.scope.get()?.useSelectedItems(store.tableId.get(), p.scopeDbClass) : [];
	useEffect(() => {
		if (selectedItems && p.scopeDbClass) store.setSelectedItems(selectedItems);
	}, [selectedItems, p.scopeDbClass]);

	// Слушаем изменение состояние выбора, если это корневая таблица и устанавливаем состояние чекбокса в заголовке.
	useHeaderCheckboxProps(store, p);

	// Состояние готовности.
	const ready = store.ready.use();

	//console.log('TableController run', selectedItems); // Считаем запуски пока разрабатываем
	// Передаем только состояние готовности. Это еще и хак, так и не смог разобраться почему без этого первая отрисовка запаздывает.
	return <TableInstance fetching={p.items ? (p.items.length ? !ready : false) : true} />;
});
