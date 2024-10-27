/* Устанавливает состояние выбора всех items иерархии.
hierarchy - не реактивен, видимо под капотом какая-то структура, которую не переваривает хранилище.
Поэтому используем selectionState как реактивные состояния каждого item.

Требование - изменение самой иерархии должны происходить до запуска этой функции.

Процесс состоит из 3-х этапов:	
	1. На основе прилетевших items и selectedItems проставляем состояние текущей таблице, пропуская indeterminate.
	2. На основе данных 1-го шага проставляем наследников, отфильтровав indeterminate.
	2. Проходим от текущей таблицы вверх по всей иерархии. Опираясь на результаты первого шага, проставляем состояния, 
		протягивая вверх indeterminate.

Такие вычисления за счет уже построенной иерархии не дороги. Это самый простой и понятный способ из тех, что я попробовал. */

import type { Item } from 'types'
import type { Selection, TabelScopeStore } from './store'

export default function (store: TabelScopeStore, items: Item[], selectedItems: Item[]) {
	// Берем состояние и просто мутируем его.
	store.set((s) => {
		// Возьмем функцию фильтрации разработчика. Используем ее далее везде, где нужно применить филтрацию.
		const multiSelectionFilterFunc = s.multiSelectionFilterFunc

		// Возьмем id выбранных для удобства.
		const selectedItemIds = selectedItems.map((i) => i.id)

		// Пройдем по всем items и проставим состояние выбора текущей таблице.
		for (const item of items) {
			// Нужно не трогать полупокеров.
			let selection: Selection = s.selectionState[item.id] === 'indeterminate' ? 'indeterminate' : 'notSelected'
			if (selectedItemIds.includes(item.id)) {
				if (multiSelectionFilterFunc && !multiSelectionFilterFunc(item)) return
				selection = 'selected'
			}
			s.selectionState[item.id] = selection
		}

		// Пройдем по всем предкам, исключая items текущей таблицы, чтобы использовать indeterminate родителя.
		for (const item of items) {
			// Возьмем ноду текущего item.
			const itemNode = s.hierarchy?.find((i) => i.data.id === item.id)
			if (itemNode) {
				// Возьмем всех наследников, исключив item текущей таблицы.
				for (const descendant of itemNode.descendants().filter((i) => i.data.id !== item.id)) {
					// Нужно не трогать полупокеров.
					const hasIndeterminate = descendant.parent?.data.id && s.selectionState[descendant.parent.data.id] === 'indeterminate'
					if (hasIndeterminate) return
					let selection: Selection = 'notSelected'
					if (selectedItemIds.includes(item.id)) {
						if (multiSelectionFilterFunc && !multiSelectionFilterFunc(item)) return
						selection = 'selected'
					}
					s.selectionState[descendant.data.id] = selection
				}
			}
		}

		// Возьмем всех предков из первого item, т.к. предки у всех item текущей таблицы теже.
		// Найдем родителя первого item, чтобы взять его пердков, т.к. пердки включают себя.
		const parentNode = s.hierarchy?.find((i) => i.data.id === items[0].id)?.parent
		if (parentNode) {
			for (const ancestor of parentNode.ancestors()) {
				const childrenCount = ancestor.children?.length || 0
				const selectedChildrenCount = ancestor.children?.filter((i) => s.selectionState[i.data.id] === 'selected').length || 0
				const indeterminateChildrenCount =
					ancestor.children?.filter((i) => s.selectionState[i.data.id] === 'indeterminate').length || 0
				// Если в детях есть полупокеры, то пртягиваем его вверх, иначе определяем состояние по разнице.
				s.selectionState[ancestor.data.id] = indeterminateChildrenCount
					? 'indeterminate'
					: childrenCount === selectedChildrenCount
						? 'selected'
						: selectedChildrenCount === 0
							? 'notSelected'
							: 'indeterminate'
			}
		}
	})
}
