/* Провайдер. Отделяет одну таблицу от другой. Устанавливает первичное состояние. Обслуживает внешние сигналы. */

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { nanoid } from 'nanoid';
import { getCompProps } from '@packages/get-comp-props';
import type { Props } from './types';
import { Provider, type Store } from './src/store';
import { getLibProps } from './src/models/libPropsModel';
import { getTableProps } from './src/models/tablePropsModel';
import { getColumns } from './src/models/columnModel';
import { getItems } from './src/models/itemModel';
import TableController from './src/TableController';

// Стили загружаем здесь, чтобы разные TableInstance использовали уже загржунный css.
import '@mantine/core/styles/Table.css';
import 'mantine-datatable/styles.css';

export default forwardRef((props: Props, ref) => {
	// Даем разработчику извращаться, если он смелый.
	const p: Props = getCompProps(props);
	// Отменяем все, если нет колонок.
	if (!p.columnsDefinition?.length) {
		R.libs.mantine?.MantineError('Системная ошибка!', 'No columns definition.');
		return;
	}

	// Внешние сигналы. TableController возвращает store через useImperativeHandle.
	// Раз мы можем вытянуть сюда store, то можно было бы использовать эту технику для реализации TableController здесь,
	// но так получается более читабельный код.
	const tableControllerRef = useRef<{ store: Store }>(null);
	useImperativeHandle(
		ref,
		() => ({
			resetSelectedItems() {
				tableControllerRef.current?.store.resetSelectedItems();
			},
		}),
		[]
	);

	//console.log('TableProvider run'); // Считаем запуски пока разрабатываем
	return (
		<Provider
			// Первичное состояние и установка дефолтов. Здесь релизуется сценарий, когда все, что нужно для отрисовки известно сразу.
			initialState={{
				noodlNode: p.noodlNode,
				tableId: nanoid(8),
				libProps: getLibProps(p),
				tableProps: getTableProps(p),
				columns: getColumns(p.columnsDefinition),
				items: getItems(p),
				selectedItems: p.selectedItems || [],
				selectedItemsFirstRun: p.selectedItems ? true : false, // Фиксируем, что есть изначально выбранные items.
				expandedIds: p.expandedItems?.map((i) => i.id) || [],
			}}
		>
			<TableController {...p} ref={tableControllerRef} />
		</Provider>
	);
});
