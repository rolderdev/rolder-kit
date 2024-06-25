/* Функция устанавливает состояние готовности строк, когда есть кастомные ячейки иди раширяемые строки. */

import type { Row } from '../models/rowMoldel';
import type { State, Store } from '../store/store';

export default function (store: Store, state: State) {
	const templateCellsCount = state.columns.filter((i) => i.type === 'template' && i.template).length * state.rows.size;
	const currentTemplateCellsCount = Array.from(state.rows.values()).reduce((acc, row) => acc + row.templateCells.size, 0);
	const expansionRowsCount = state.tableProps.expansion.enabled ? state.rows.size : 0;
	const currentExpansionRowsCount = Array.from(state.rows.values()).filter((i) => i.expansionRow).length;

	if (
		Array.from(state.rows.values()).some((i) => !i.ready) &&
		currentTemplateCellsCount === templateCellsCount &&
		currentExpansionRowsCount === expansionRowsCount
	) {
		const rows = new Map<string, Row>();
		state.rows.forEach((v, k) => {
			rows.set(k, { ...v, ready: true });
		});
		store.setState({ rows });
		// Уберем анимацию, если это первая загрзука.
		if (state.fetching) store.setState({ fetching: false });
	}
}
