import { hierarchy } from 'd3-hierarchy';
import omit from 'just-omit';
import { HierarchyItem, Props } from '../types';
import { Item } from '@shared/types-v0.1.0';
import { snapshot } from 'valtio';

export default (p: Props) => {
	let rootData: Item['hierarchyData'] = {};

	p.store.schemes.forEach((d) => {
		// Запретим редактирование всего кроме items.
		if (!d.parentId) rootData[d.scheme.dbClass] = { ...omit(snapshot(d), ['items']), items: d.items };
	});

	const dataHierarchy = hierarchy<HierarchyItem>(
		{
			id: p.store.useDataId, // Корень содержит только id самой useData.
			item: undefined as any,
			hierarchyData: rootData, // Библиотека требует одинаковой структуры для построения иерархии.
		},
		// Этот колбек строит иерархию. Должен выдавать детей. В нашем случае для всех классов в hierarchyData.
		// За счет того, что сервер возвращает структуру схем можно построить иерархию не спрашивая разработчика.
		(d) => {
			if (d.hierarchyData) {
				const childrenWithHdata = Object.values(d.hierarchyData)
					.map((i) => i.items)
					.filter((i) => i !== undefined)
					.flat();
				let children: HierarchyItem[] = [];
				p.store.schemes.forEach((d) => {
					const child = childrenWithHdata.find((i) => i.id === d.parentId);
					if (child) {
						let hierarchyData: Item['hierarchyData'] = {};

						p.store.schemes.forEach((d) => {
							// Запретим редактирование всего кроме items.
							if (child.id === d.parentId) hierarchyData[d.scheme.dbClass] = { ...omit(snapshot(d), ['items']), items: d.items };
						});

						children.push({ id: child.id, item: child, hierarchyData });
					}
				});

				return children;
			}
		}
	);

	p.store.hierarchy = dataHierarchy;
};
