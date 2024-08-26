import { hierarchy } from 'd3-hierarchy';
import type { Props } from '../types';
import type { HierarchyItem, HierarchyData } from '../node/store';
import addNodeFunctions from './addNodeFunctions';
import type { Item } from '@shared/types-v0.1.0';

export default (p: Props) => {
	const { get, set } = R.libs.just;
	const rootId = p.store.rootId;

	// Библиотека требует одинаковой структуры для построения иерархии.
	const hierarchyData: HierarchyData = {};
	p.store.data.schemes.forEach((schemeData) => {
		if (!schemeData.parentId) hierarchyData[schemeData.scheme.dbClass] = schemeData;
	});

	const hierarchyItem = {
		dbClass: 'hierarchyRootItem',
		id: rootId,
		hierarchyData,
	} as HierarchyItem;

	hierarchy<HierarchyItem>(
		hierarchyItem,
		// Этот колбек строит иерархию. Должен выдавать детей. В нашем случае для всех классов каждой схемы.
		// За счет того, что сервер возвращает структуру схем можно построить иерархию не спрашивая разработчика.
		(hierarchyItem) => {
			let children: HierarchyItem[] = []; // Итоговые дети для возврата.
			// Только если предыдущий шаг рекурсии вернул hierarchyData.
			if (hierarchyItem.hierarchyData) {
				// Возьмем id всех детей всех классов.
				const childIds = Object.values(hierarchyItem.hierarchyData)
					.map((i) => i.itemIds)
					.flat();

				// Создадим для каждого ребенка hierarchyData, чтобы запустить рекурсию и добавим его в детей.
				for (const childId of childIds) {
					let hierarchyData: HierarchyData = {};
					// Возьмем из каждой схемы ее schemeData и добавим в hierarchyData.
					p.store.data.schemes.forEach((schemeData) => {
						if (childId === schemeData.parentId) hierarchyData[schemeData.scheme.dbClass] = schemeData;
					});

					// Возьмем прилетевший с бекенда item.
					const childItem = p.store.data.items.get(childId);
					if (childItem) {
						// Построим hierarchyItem.
						const hierarchyItem = {
							dbClass: childItem.dbClass,
							id: childItem.id,
							hierarchyData,
						} as HierarchyItem;

						children.push(hierarchyItem);
					}
				}
			}

			return children;
		}
		// Когда иерархия готова - есть конструкции нод.
	).each((node) => {
		const backendItem = node.data.id === rootId ? ({ id: rootId } as Item) : p.store.data.items.get(node.data.id);
		if (node.data.id === rootId) console.log(node);
		if (backendItem) {
			// Добавим функции, чтобы можно было пользоваться иерархией прямо из item.
			const backendItemWithFunctions = addNodeFunctions(node, backendItem, p.store);

			// Состояния.
			const rootNode = node.ancestors().find((i) => i.data.id === rootId);
			if (rootNode) {
				const path = node
					.path(rootNode)
					.map((i) => i.data.id)
					.join();
				if (path) {
					const itemSelectionState = get(p.store.itemsSelectionState, path);
					if (!itemSelectionState) set(p.store.itemsSelectionState, path, R.libs.valtio.proxy({ selection: 'notSelected' }));
				}
			}

			// Обновим item в самом конце, чтобы функции выдавали актуальные данные.
			const item = R.items.get(backendItem.id);
			if (!R.libs.just.compare(item, backendItem)) {
				//console.log('useData changes', backendItem.content?.horsepower);
				R.items.set(backendItem.id, backendItemWithFunctions);
				const subscribes = R.subscribes.get(backendItem.id);
				if (!subscribes) R.subscribes.set(backendItem.id, []);
			}

			if (backendItem.id === rootId) p.store.rootItem = backendItemWithFunctions;
		}
	});
};
