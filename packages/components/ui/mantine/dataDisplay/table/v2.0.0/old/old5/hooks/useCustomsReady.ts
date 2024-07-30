import { useEffect } from 'react';
import { useStore } from 'zustand';
import type { Row } from '../models/rowMoldel';
import type { Store } from '../store/store';

export default function (store: Store) {
	// Реактивность на изменение параметров.
	const hasCustoms = useStore(store, (s) => s.columns?.some((i) => i.type === 'template') || s.tableProps.expansion.enabled);

	useEffect(() => {
		// Выключим отслеживание, если нужно.
		const unsubRowswReady =
			hasCustoms &&
			store.subscribe((state) => {
				const templateCellsCount = state.columns.filter((i) => i.type === 'template' && i.template).length * state.rows.size;
				const currentTemplateCellsCount = Array.from(state.rows.values()).reduce((acc, row) => acc + row.templateCells.size, 0);
				const expansionRowsCount = state.tableProps.expansion.enabled ? state.rows.size : 0;
				const currentExpansionRowsCount = Array.from(state.rows.values()).filter((i) => i.expansionRow).length;

				if (
					Array.from(state.rows.values()).some((i) => !i.ready) &&
					currentTemplateCellsCount === templateCellsCount &&
					currentExpansionRowsCount === expansionRowsCount
				) {
					const rows = new Map<string, Row>(); // React рекомендует пересоздавать Map.
					state.rows.forEach((v, k) => {
						rows.set(k, { ...v, ready: true });
					});
					//setTimeout(() => store.setState({ rows }));
					store.setState({ rows });
					// Уберем анимацию, если это первая загрзука.
					if (state.fetching) store.setState({ fetching: false });
				}
			});

		return () => {
			unsubRowswReady && unsubRowswReady();
		};
	}, [hasCustoms]);

	/* 	const hasCustoms = useStore(store, (s) => s.columns?.some((i) => i.type === 'template') || s.tableProps.expansion.enabled);

	// Выключим отслеживание, если нужно
	//if (hasCustoms) {
	const rows = useStore(store, (s) => s.rows);
	const templateCells = useStore(store, (s) => s.rows.forEach((v, k) => v.templateCells));
	const fetching = useStore(store, (s) => s.fetching);
	console.log('useCustomsReady', templateCells);
	const currentTemplateCellsCount = Array.from(rows.values()).reduce((acc, row) => acc + row.templateCells.size, 0);
	const templateCellsCount = useStore(store, (s) => s.columns.filter((i) => i.type === 'template' && i.template).length);
	const currentExpansionRowsCount = Array.from(rows.values()).filter((i) => i.expansionRow).length;
	const expansionRowsCount = useStore(store, (s) => (s.tableProps.expansion.enabled ? s.rows.size : 0));

	console.log({ currentTemplateCellsCount, templateCellsCount, currentExpansionRowsCount, expansionRowsCount });
	if (
		Array.from(rows.values()).some((i) => !i.ready) &&
		currentTemplateCellsCount === templateCellsCount &&
		currentExpansionRowsCount === expansionRowsCount
	) {
		const newRows = new Map(rows); // React рекомендует пересоздавать Map.
		newRows.forEach((v, k) => newRows.set(k, { ...v, ready: true }));
		store.setState({ rows: newRows });
		console.log(
			'useCustomsReady',
			Array.from(rows.values()).map((i) => i.ready)
		);
		// Уберем анимацию, если это первая загрзука.
		if (fetching) store.setState({ fetching: false });
	}
	//} */
}
