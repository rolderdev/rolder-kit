import { hierarchy } from 'd3-hierarchy';
import type { Props } from '../types';
import type { FrontItem } from '@shared/types-v0.1.0';
import type { HierarchyItem, HierarchyData } from '../node/store';

export default (p: Props) => {
	const { proxy } = R.libs.valtio;

	let hierarchyItem = p.store.hierarchyItems.get('root');
	if (!hierarchyItem) {
		// Библиотека требует одинаковой структуры для построения иерархии.
		let hierarchyData: HierarchyData = {};
		p.store.schemes.forEach((schemeData) => {
			if (!schemeData.parentId) hierarchyData[schemeData.scheme.dbClass] = schemeData;
		});

		hierarchyItem = {
			dbClass: '',
			id: 'root',
			kid: '',
			item: {} as FrontItem,
			state: proxy({ selection: 'notSelected' }),
			hierarchyData,
		} as HierarchyItem;
	}
	p.store.hierarchyItems.set('root', hierarchyItem);

	const rootHierarchyNode = hierarchy<HierarchyItem>(
		hierarchyItem,
		// Этот колбек строит иерархию. Должен выдавать детей. В нашем случае для всех классов каждой схемы.
		// За счет того, что сервер возвращает структуру схем можно построить иерархию не спрашивая разработчика.
		(hierarchyItem) => {
			let children: HierarchyItem[] = [];
			// Только если предыдущий шаг рекурсии вернул hierarchyData.
			if (hierarchyItem.hierarchyData) {
				// Вытянем всех детей всех классов.
				const childFrontItems = Object.values(hierarchyItem.hierarchyData)
					.map((i) => i.itemIds.map((id) => i.items.get(id))) // Возьмем в отсортированном порядке.
					.flat()
					.filter((i) => i !== undefined);

				// Создадим для каждого ребенка hierarchyData, чтобы запустить рекурсию и добавим его в детей.
				for (const childFrontItem of childFrontItems) {
					// Проверим, создавался ли такой hierarchyItem.
					// Поскольку в нем ссылка на схему, его можно использовать как есть, он уже содержит свежие данные.
					const childHierarchyItem = p.store.hierarchyItems.get(childFrontItem.id);
					if (childHierarchyItem) children.push(childHierarchyItem);
					else {
						// Если hierarchyItem нет, нужно создать его первый раз.
						let hierarchyData: HierarchyData = {};

						// Возьмем из каждой схемы ее schemeData и добавим в hierarchyData.
						p.store.schemes.forEach((schemeData) => {
							if (childFrontItem.kid === schemeData.parentId) hierarchyData[schemeData.scheme.dbClass] = schemeData;
						});

						// Построим hierarchyItem.
						p.store.hierarchyItems.set(childFrontItem.id, {
							dbClass: childFrontItem.dbClass,
							id: childFrontItem.id,
							kid: childFrontItem.kid,
							item: childFrontItem,
							state: proxy({ selection: 'notSelected' }), // Добавим дефолтное состояние выбора.
							hierarchyData,
						});
						const hierarchyItem = p.store.hierarchyItems.get(childFrontItem.id);
						if (hierarchyItem) children.push(hierarchyItem);
					}
				}
			}

			return children;
		}
		// Когда иерархия готова - есть конструкции нод.
	).each((node) => {
		// Добавим функции для удоства разработки в Roodl.
		// Наследники.
		node.data.getDescendants = (p) => {
			let selectedNodes = node.descendants().filter((i) => i.data.dbClass === p.dbClass && i.id !== 'root');
			if (p.skipSelf) selectedNodes.filter((i) => i.id !== node.id);
			return selectedNodes.map((i) => i.data.item);
		};
		// Предки.
		node.data.getAncestors = (p) => {
			let selectedNodes = node.descendants().filter((i) => i.data.dbClass === p.dbClass && i.id !== 'root');
			if (p.skipSelf) selectedNodes.filter((i) => i.id !== node.id);
			return selectedNodes.map((i) => i.data.item);
		};
		// Выбор.
		node.data.getSelected = (p) => {
			const states = p.withIndeterminate ? ['selected', 'indeterminate'] : ['selected'];
			let selectedNodes = node
				.descendants()
				.filter((i) => i.data.dbClass === p.dbClass && states.includes(i.data.state.selection) && i.id !== 'root');
			if (!p?.withParent) selectedNodes = selectedNodes.filter((i) => i.data.id !== node.data.id);
			return selectedNodes.map((i) => i.data.item);
		};
	});

	p.store.rootHierarchyNode = proxy(rootHierarchyNode);
};
