/* Хука для изменения состояния развернутых строк
Эта хука меняет состояние таблицы и выходного порта. Оне не держит состояние, а сама подписывается на atom.
Не используется в useExpanderCell */

import { useStore } from '@nanostores/react';
import { useShallowEffect } from '@mantine/hooks';
import { sendOutput, sendSignal } from '@packages/port-send';
import type { TableState } from '../../types';
import type { Item } from 'types';
import { expendRows, expendedRowsIdsAtom } from '../../models/expansionRows';

export default function (
	tableState: TableState,
	expansion: boolean | undefined,
	firstRender: boolean,
	expandedItems: Item[] | undefined,
	setTableState: (statePartial: Partial<TableState> | ((currentState: TableState) => Partial<TableState>)) => void
) {
	// Реактивность на состояние разввертывания
	const expendedRowsIds: string[] = useStore(expendedRowsIdsAtom(tableState.tableId));
	// Здесь зависимость - массив литералов. useEffect должен работать, но он создает цикл. Не понял почему. useShallowEffect - норм.
	useShallowEffect(() => {
		// Пропускаем таблицу без развертывния и первый рендер
		// При следующих изменениях обновляем таблицу и выходной порт и сигнал
		if (expansion && !firstRender) {
			setTableState((s) => {
				s.expendedRowsIds = expendedRowsIds;
				return s;
			});
			sendOutput(
				tableState.noodlNode,
				'expandedItems',
				tableState.records?.filter((i) => expendedRowsIds.includes(i.id))
			);
			sendSignal(tableState.noodlNode, 'expansionChanged');
		}
	}, [expansion, expendedRowsIds]); // Реагируем и на порт expansion

	// Реактивность на внешнее изменение expansion
	useShallowEffect(() => {
		if (expandedItems)
			expendRows(
				tableState.tableId,
				expandedItems.map((i) => i.id)
			);
	}, [expandedItems]);
}
