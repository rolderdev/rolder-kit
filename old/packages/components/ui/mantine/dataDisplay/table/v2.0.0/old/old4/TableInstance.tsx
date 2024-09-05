/* Сама таблица */

import { DataTable } from 'mantine-datatable';
import { memo, useContext } from 'react';
import { useSnapshot } from 'valtio';
import type { Store } from '../types';
import type { Record } from './models/recordMoldel';
import { TableContext } from '../table';
import AccessorCell from './render/AccessorCell';
import GetValueCell from './render/GetValueCell';
import TemplateCell from './render/TemplateCell';

// memo остановит любой рендер пришедший сверху, т.к. props просто нет.
export default memo(() => {
	const store = useContext(TableContext);
	const snap = useSnapshot(store) as Store; // Чтобы не типизировать контекст и убрать readonly, который не принимает библиотека.

	console.log('Table render', snap.tableId); // Считаем рендеры пока разрабатываем
	return (
		<DataTable<Record>
			// Base
			fetching={false}
			columns={snap.columns.map((column, columnIdx) => {
				// Подставляем свою ячейку.
				return {
					...column,
					accessor: `${columnIdx}`, // Нужно дать библиотеке фиксированный accessor, т.к. она использует его как id.
					// Нужно подавать адишники, иначе теряется точечная реактивность.
					render: (record) => {
						if (column.type === 'accessor' && column.accessor)
							return <AccessorCell recordId={record.id} accessor={column.accessor} />;
						if (column.type === 'getValue' && column.getValueStringFunc)
							return <GetValueCell recordId={record.id} getValueStringFunc={column.getValueStringFunc} />;
						if (column.type === 'template' && column.template) return <TemplateCell recordId={record.id} columnIdx={columnIdx} />;
						return undefined;
					}
				};
			})}
			records={Array.from(snap.records.values())}
			{...snap.libProps}
		/>
	);
});
