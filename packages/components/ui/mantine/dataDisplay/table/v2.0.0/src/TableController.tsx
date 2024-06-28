/* Управляющая компонента. Управляет состояние дочерней TableInstance. */

import { forwardRef, useEffect, useImperativeHandle } from 'react';
import type { Props } from '../types';
import { useStore } from './store';
import TableInstance from './TableInstance';
import sendSelectedItems from './senders/sendSelectedItems';

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
		store.setExpansionRows(p);
	}, [p]);

	// Подписка на изменения для отправки в порты.
	useEffect(() => {
		const unsubSelectedIds =
			store.tableProps.selection.multi.get() &&
			store.selectedIds.onChange((newSelectedIds) => sendSelectedItems(store, newSelectedIds));
		return () => {
			unsubSelectedIds && unsubSelectedIds();
		};
	}, []);

	console.log('TableController run'); // Считаем запуски пока разрабатываем
	// Передаем только состояние готовности. Это еще и хак, так и не смог разобраться почему без этого первая отрисовка запаздывает.
	return <TableInstance fetching={p.items ? false : true} />;
});
