/* Управляющая компонента. Управляет состояние дочерней TableInstance. */

import { createContext, forwardRef, useEffect, useMemo, useRef } from 'react';
import { proxy, ref, useSnapshot } from 'valtio';
import { proxyMap } from 'valtio/utils';
import { nanoid } from 'nanoid';
import { getCompProps } from '@packages/get-comp-props';
import type { Props, Store } from './types';
import { getLibProps } from './src/models/libPropsModel';
import TableInstance from './src/TableInstance';

// Стили загружаем здесь, чтобы разные TableInstance загржунный css.
import '@mantine/core/styles/Table.css';
import 'mantine-datatable/styles.css';
import { getTableProps } from './src/models/tablePropsModel';
import { getColumns, setColumns } from './src/models/columnModel';
import { getRecords, setRecords } from './src/models/recordMoldel';
import getTemplateCell from './src/funcs/getTemplateCell';

// Создадим контекст для разделения нескольких таблиц.
const TableContext = createContext({ tableId: '' });
export { TableContext };

export default forwardRef((props: Props) => {
	// Даем разработчику извращаться, если он смелый.
	const p: Props = getCompProps(props);

	// useRef - так Valtio разделяет состояние по контекстам.
	const store = useRef(
		// Созадим первичное состояние на основе прилетевших первый раз porps.
		// useMemo для запрета выполнять функции повторно. proxy их выполняет, хоть и не обновляет состояние.
		proxy<Store>({
			noodlNode: ref(p.noodlNode),
			tableId: nanoid(8),
			ready: !p.columnsDefinition.some((i) => i.type === 'template'),
			libProps: useMemo(() => getLibProps(p), []),
			tableProps: useMemo(() => getTableProps(p), []),
			columns: useMemo(() => getColumns(p.columnsDefinition), []),
			records: proxyMap(useMemo(() => getRecords(p.noodlNode, p.items || [], getColumns(p.columnsDefinition)), []))
			/* templateCells: proxyMap(async () => {
				const cellsMap = new Map<string, Map<number, React.ReactNode>>();
				await Promise.all(
					p.items?.map(async (item) => {
						await Promise.all(
							p.columnsDefinition.map(async (column, columnIdx) => {
								if (column.type === 'template' && column.template) {
									const reactNode = await getTemplateCell(p.noodlNode, column.template, item.id);
									cellsMap.set(item.id, new Map().set(columnIdx, reactNode));
								}
							})
						);
					})
				);
				return cellsMap;
			}) */
		})
	).current;

	// Реактивность на изменение настроек.
	useEffect(() => {
		store.libProps = getLibProps(p);
		store.tableProps = getTableProps(p);
	}, [p]);

	// Реактивность на изменение схемы колонок.
	useEffect(() => setColumns(store, p.columnsDefinition), [p.columnsDefinition]);

	// Реактивность на изменение схемы колонок.
	useEffect(() => {
		if (p.items) setRecords(store, p.items);
	}, [p.items]);

	console.log('Table run', store.tableId); // Считаем запуски пока разрабатываем
	return (
		<TableContext.Provider value={store}>
			<TableInstance />
		</TableContext.Provider>
	);
});
