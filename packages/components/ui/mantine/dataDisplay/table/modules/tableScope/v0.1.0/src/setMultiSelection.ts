/* Устанавливает состояние всех items иерархии.
hierarchy - не реактивен, видимо под капотом какая-то структура, которую не переваривает хранилище.
Поэтому используем tablesSelectedItems и indeterminated как реактивные состояния каждой таблицы.

Процесс состоит из 3-х этапов:
	1. Начинаем с текущей таблицы. Здесь доверяем тому, что прилетело с таблицы. Там свои проверки.
	2. На основе ее данных проходим от нее вниз по иерархии устанавливая или cнимая чекбокс. Здесь не может быть "indeterminate".
	3. Проходим от текущей таблицы вверх по всей иерархии. Опираясь на результаты первых шагов, проставляем состояния.

Такие вычисления за счет уже построенной иерархии не дороги. Это самый простой и понятный способ из тех, что я попробовал. */

import type { Item } from 'types';
import type { TabelScopeStore } from './store';
import { sendOutputs } from '@packages/port-send';

export default function (store: TabelScopeStore, tableId: string, dbClass: string, selectedChildren: Item[]) {
	// Берем состояние и просто мутируем его.
	store.set((s) => {
		// Возьмем функцию фильтрации разработчика. Используем ее далее везде, где нужно применить филтрацию.
		const isRecordSelectable = s.isRecordSelectable;

		// Выясним, что изменилось, чтобы изменять только нужную часть иерархии.
		// При этом учитываем, что selectedChildren - это выбор одной таблицы, а могут быть соседи.
		const currentSelectedIds = s.tablesSelectedItems[tableId]?.filter((i) => i.dbClass === dbClass).map((i) => i.id) || [];
		const newSelectedIds = selectedChildren.filter((i) => !currentSelectedIds.includes(i.id)).map((i) => i.id);
		const newNotSelectedIds = currentSelectedIds?.filter((i) => !selectedChildren?.map((i) => i.id).includes(i)) || [];

		// Будем замерять скорость пока разрабатываем.
		//const startTime = performance.now();

		// Установим выбор текущей таблицы, добавив состояние соседних таблиц.
		//// Текущая таблица ////
		s.tablesSelectedItems[tableId] = [
			...selectedChildren,
			...(s.tablesSelectedItems[tableId]?.filter((i) => i.dbClass !== dbClass) || []),
		];
		// Уберем indeterminate у изменений текущей таблицы.
		const tableNode = s.hierarchy?.find((i) => i.data.id === tableId);
		tableNode?.children?.map((child) => {
			if (newSelectedIds.includes(child.data.id) || newNotSelectedIds.includes(child.data.id))
				s.indeterminated[child.data.id] = false;
		});

		// Добавление выбранных.
		for (const newSelectedId of newSelectedIds) {
			const itemNode = s.hierarchy?.find((i) => i.data.id === newSelectedId);
			if (itemNode) {
				//// Текущая таблица ////
				itemNode.data.state = 'checked';
				s.tablesSelectedItems[itemNode.data.id] =
					itemNode.children
						?.filter((i) => (isRecordSelectable ? isRecordSelectable(i.data.item) : true))
						?.map((i) => i.data.item) || [];
				//// Наследники ////
				// Найдем всех наследников, исключив текущий item.
				// descendants выдает наследников в нужном порядке, переберая поколение за поколением сверху вниз,
				// что позваляет рекурсиво проставить состояние.
				const descendants = itemNode.descendants().filter((i) => i.data.id !== itemNode.data.id);
				for (const descendant of descendants) {
					if (isRecordSelectable) descendant.data.state = isRecordSelectable(descendant.data.item) ? 'checked' : 'notChecked';
					else descendant.data.state = 'checked';
					s.tablesSelectedItems[descendant.data.id] =
						descendant.children
							?.filter((i) => (isRecordSelectable ? isRecordSelectable(i.data.item) : true))
							?.map((i) => i.data.item) || [];
					s.indeterminated[descendant.data.id] = false;
				}
			}
		}

		// Удаление не выбранных.
		for (const newNotSelectedId of newNotSelectedIds) {
			const itemNode = s.hierarchy?.find((i) => i.data.id === newNotSelectedId);
			if (itemNode) {
				//// Текущая таблица ////
				itemNode.data.state = 'notChecked';
				s.tablesSelectedItems[itemNode.data.id] = [];
				//// Наследники ////
				const descendants = itemNode.descendants().filter((i) => i.data.id !== itemNode.data.id);
				for (const descendant of descendants) {
					descendant.data.state = 'notChecked';
					s.tablesSelectedItems[descendant.data.id] = [];
					s.indeterminated[descendant.data.id] = false;
				}
			}
		}

		//// Предки ////
		// Предки должны знать состояние всех потомков, поэтому отдельным шагом.
		// Найдем всех предков текущей таблицы.
		const ancestors = s.hierarchy?.find((i) => i.data.id === tableId)?.ancestors();
		if (ancestors)
			for (const ancestor of ancestors) {
				// Найдем детей и выбранных детей, чтобы проставить состояние.
				// Мы знаем какие дети выбраны с предыдущих этапов и с рекурсии этого этапа.
				const children = ancestor.children?.filter((i) => (isRecordSelectable ? isRecordSelectable(i.data.item) : true));
				const checkedChildren = children?.filter((i) => i.data.state === 'checked');
				// Выясним, есть ли полупокеры, чтобы протянуть полупокерство вверх по иерархии.
				const childrenHasIndeterminate = ancestor.children?.some((i) => i.data.state === 'indeterminate');
				// Если все вбыраны.
				if (children?.length === checkedChildren?.length) ancestor.data.state = 'checked';
				// Если нет выбранных и нент полупокера.
				if (!checkedChildren?.length && !childrenHasIndeterminate) ancestor.data.state = 'notChecked';
				// Тут хитро. Если полупокер есть, протягиваем вверх и используем рекурсивно.
				// Или если это первый раз проверка на полупокерство, ставим при разности детей и выбранных.
				if (childrenHasIndeterminate || (checkedChildren?.length && children?.length !== checkedChildren?.length))
					ancestor.data.state = 'indeterminate';

				// Для выбранных достаточно знать выбранных детей.
				s.tablesSelectedItems[ancestor.data.id] = checkedChildren?.map((i) => i.data.item) || [];
				// Используем логику выше, чтобы добавить полупекеров в реактивность.
				if (ancestor.data.state === 'indeterminate') s.indeterminated[ancestor.data.id] = true;
				else s.indeterminated[ancestor.data.id] = false;
			}

		//console.log('TableScope multiSelection', performance.now() - startTime);
	});

	// Отправка в порт. Нужно делать это за рамками store.set, т.к. Noodl ругается на прокси.
	sendOutputs(
		store.noodlNode.get(),
		store.selectionDbClasses.get().map((dbClass) => ({
			portName: dbClass,
			value: Object.values(store.tablesSelectedItems.get())
				.flat()
				.filter((i) => i?.dbClass === dbClass),
		}))
	);
}
