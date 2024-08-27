import { hierarchy, type HierarchyNode } from 'd3-hierarchy';
import type { Props } from '../types';
import type { HierarchyItem, HierarchyData } from '../node/store';
import addItemFunctions from './addItemFunctions';
import type { Item } from '@shared/types-v0.1.0';

export default (p: Props) => {
	const { get, set, map, compare } = R.libs.just;
	const s = p.store;
	const rootId = s.rootId;

	// Библиотека требует одинаковой структуры для построения иерархии.
	const hierarchyData: HierarchyData = {};
	s.data.schemes.forEach((schemeData) => {
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
					s.data.schemes.forEach((schemeData) => {
						if (childId === schemeData.parentId) hierarchyData[schemeData.scheme.dbClass] = schemeData;
					});

					// Возьмем прилетевший с бекенда item.
					const childItem = s.data.items.get(childId);
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
		const rootNode = node.ancestors().find((i) => i.data.id === rootId) as HierarchyNode<HierarchyItem>;
		let path = node
			.path(rootNode)
			.map((i) => i.data.id)
			.join();

		const backendItem = node.data.id === rootId ? ({ id: rootId } as Item) : s.data.items.get(node.data.id);
		if (backendItem) {
			const item = R.items.get(backendItem.id);

			// Добавим функции, чтобы можно было пользоваться иерархией прямо из item.
			const { changeState, backendItemWithFuncs } = addItemFunctions(s, node, backendItem, item);
			//console.log(changeState, backendItemWithFuncs);

			// Состояния.
			const itemSelectionState = get(s.itemsSelectionState, path);
			if (!itemSelectionState) set(s.itemsSelectionState, path, R.libs.valtio.proxy({ selection: 'notSelected' }));

			// Обновим item в самом конце, чтобы функции выдавали актуальные данные.
			if (Object.values(changeState).includes(true) || !compare(item, backendItem)) {
				//console.log('useData changes');
				R.items.set(backendItem.id, backendItemWithFuncs);
				// Запуск тригера для каждой функции после ее обновления.
				map(changeState, (funcName, changed) => changed && Noodl.Events.emit(`${funcName}_${backendItem.id}`));
				// Дефолт для подписок, чтобы не проверять.
				const subscribes = R.itemHandlers.subscribes.get(backendItem.id);
				if (!subscribes) R.itemHandlers.subscribes.set(backendItem.id, []);
			}

			if (backendItem.id === rootId) s.rootItem = backendItemWithFuncs;
		}
	});
};
