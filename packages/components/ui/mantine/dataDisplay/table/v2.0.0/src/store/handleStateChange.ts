// Функция обработки изменений холодного хранилища и обновления горячего.

import { getHotColumns } from '../models/columnModel';
import { frontSortItems } from '../models/sortModel';
import type { ChangeState, Store } from './store';

export default async (s: Store, changeState: ChangeState) => {
	// Пропустим выполнение функции, когда все состояния помечены false.
	if (!Object.values(changeState).includes(true)) return;
	//console.log('stateChganged', Noodl.Objects[s.tableId.get()].content?.name, changeState);

	const resetState = {
		libProps: false,
		tableProps: false,
		columns: false,
		items: false,
		itemsContent: false,
		selectedItems: false,
		expandedItems: false,
	} as ChangeState;

	// Установим все новые состояния разом, чтобы был только один рендер.
	s.set((state) => {
		if (changeState.libProps) state.hot.libProps = state.cold.libProps;
		if (changeState.tableProps) state.hot.tableProps = state.cold.tableProps;
		if (changeState.columns) state.hot.columns = getHotColumns(s);
		if (changeState.items || changeState.itemsContent) {
			// Установим items в горячее хранилище, учитывая сортировку.
			if (state.cold.items) {
				const sort = state.cold.tableProps.sort;
				if (sort.enabled && sort.type === 'frontend') state.hot.items = frontSortItems(s); // Только фронт.
				else state.hot.items = state.cold.items;
			}
		}
		if (changeState.selectedItems) state.hot.selectedItems = state.cold.selectedItems;
		if (changeState.expandedItems) state.hot.expandedIds = state.cold.expandedItems?.map((i) => i.id);

		state.changeState = resetState;

		// Запустим первый рендер
		if (!state.inited) state.inited = true;

		// Остановим анимацию загрузки, если есть items.
		// 1 рендер, когда items есть сразу. 2, когда прилетают позже.
		// Это вариант без кастомных ячеек, ниже вариант с ними.
		if (!state.cold.columnsDefinition.some((i) => i.type === 'template') && state.cold.items && state.fetching)
			state.fetching = false;
	});

	// Остановим анимацию загрузки, если есть items.
	// 2 рендера, когда items есть сразу. 3, когда прилетают позже.
	// Это вариант для кастомных ячеек, выше вариант без них.
	if (s.cold.columnsDefinition.get().some((i) => i.type === 'template')) {
		if (s.inited.get() && s.cold.items.get()) {
			// Сделаем небольшую задержку на длительность развертывания анимации + 1, чтобы показать анимацию загрузки.
			await new Promise((r) => setTimeout(r, 151));
			s.fetching.set(false);
		}
	}
};
