/* Создает и обновляет иерархию. */

import { hierarchy } from 'd3-hierarchy';
import { sendOutput } from '@packages/port-send';
import type { Item } from 'types';
import type { TabelScopeStore } from './store';
import setupMultiSelection from './setupMultiSelection';

export default function (store: TabelScopeStore, rootId: string, items: Item[]) {
	// Возьмем классы, запрошенные разработчиком.
	const selectionDbClasses = store.selectionDbClasses.get();

	// Создадим иерархию на основе иерархии UseData так, чтобы в детях были все заданные классы.
	const itemsHierarchy = hierarchy(
		{
			id: rootId,
			hierarchyData: { [selectionDbClasses[0]]: { items } },
		},
		// Функция, которая возвращает детей для постороения иерархии.
		// Скажем, что дети - это все встречающиеся классы selectionDbClasses в hierarchyData каждого item.
		// Так получается один родитель для всех вложенных таблиц.
		(d: any) => selectionDbClasses.map((i) => d.hierarchyData?.[i]?.items || []).flat()
	).each((node) => {
		// Преобразуем структуру ноды, добавив дефолтное состояние.
		node.data = {
			// Сохраним id и dbClass на верхнем уровне для удобства.
			id: node.data.id,
			// Сохраним фронтовые id, если они есть.
			fid: node.data.fid,
			dbClass: node.data.dbClass,
			item: node.data, // Сохраним оригинальный item, чтобы передавать его в порт, не удивляя разработчика.
		};

		return node;
	});

	sendOutput(store.noodlNode.get(), 'hierarchy', itemsHierarchy);
	store.hierarchy.set(itemsHierarchy);

	// Внесем изменения в выбор по результату перестройик иерархии. После установки иерархии, т.к. используется внтури.
	setupMultiSelection(store);
}
